const express = require("express");
const axios = require("axios");
const router = express.Router();
const Groq = require("groq-sdk");

const UDEMY_CLIENT_ID = process.env.UDEMY_CLIENT_ID;
const UDEMY_CLIENT_SECRET = process.env.UDEMY_CLIENT_SECRET;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

router.get("/search-courses", async (req, res) => {
  const { query } = req.query;
  
  // Re-check groq object if not initialized
  const currentGroq = groq || (process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null);

  // 1. Try Groq AI first if available
  if (currentGroq) {
    try {
      console.log("Initiating Groq AI recommendation flow...");
      
      const modelsToTry = [
        "llama-3.3-70b-versatile",
        "llama3-8b-8192", 
        "mixtral-8x7b-32768"
      ];
      
      let responseText = null;
      let usedModel = "";

      for (const model of modelsToTry) {
        try {
          console.log(`Attempting Groq generation with model: ${model}`);
          
          // Add a 20-second timeout to the AI call
          const chatCompletion = await Promise.race([
            currentGroq.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: "You are a professional course recommendation expert. Generate a list of exactly 10 high-quality, distinct courses for the given topic. Focus on providing diverse and accurate titles. Respond ONLY with a JSON object containing a 'results' array. Each object must have: 'title', 'instructor_name', 'price' (e.g. '$19.99'), 'image_url', and 'headline'."
                },
                {
                  role: "user",
                  content: `Recommend 10 best, distinct courses for: ${query}. Respond ONLY with the JSON object.`
                }
              ],
              model: model,
              response_format: { type: "json_object" }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Groq API Timeout")), 20000))
          ]);
          
          responseText = chatCompletion.choices[0].message.content;
          usedModel = model;
          break;
        } catch (modelError) {
          console.error(`Model ${model} failed:`, modelError.message);
        }
      }

      if (responseText) {
        const responseContent = JSON.parse(responseText);
        const rawResults = responseContent.results || responseContent.courses || Object.values(responseContent).find(Array.isArray) || [];

        if (Array.isArray(rawResults) && rawResults.length > 0) {
          // Map to UI format and fix URLs to use Udemy Search
          const results = rawResults.map(c => ({
            title: c.title,
            visible_instructors: [{ display_name: c.instructor_name || "Expert Instructor" }],
            image_480x270: c.image_url || "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
            price: c.price || "$19.99",
            headline: c.headline || `Comprehensive course on ${c.title}`,
            url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(c.title)}`
          }));

          console.log(`Successfully generated ${results.length} courses via Groq (${usedModel})`);
          return res.json({ results, source: 'groq_ai' });
        }
      }
    } catch (error) {
      console.error("Groq Flow Error:", error.message);
    }
  } else {
    console.error("Groq AI not initialized. Check GROQ_API_KEY in .env");
  }

  // 2. Fallback to Udemy if Groq fails or is not configured
  if (UDEMY_CLIENT_ID && UDEMY_CLIENT_SECRET) {
    try {
      const auth = Buffer.from(`${UDEMY_CLIENT_ID}:${UDEMY_CLIENT_SECRET}`).toString('base64');
      const response = await axios.get(
        `https://www.udemy.com/api-2.0/courses/?search=${query}&page_size=10`,
        {
          headers: { "Authorization": `Basic ${auth}` },
          timeout: 10000 // 10s timeout for Udemy
        }
      );

      if (response.data && response.data.results && response.data.results.length > 0) {
        return res.json({
          results: response.data.results,
          source: 'udemy_api'
        });
      }
    } catch (error) {
      console.error("Udemy API Error:", error.message);
    }
  }

  // 3. Final Fallback to robust static data
  res.json({
    results: getFallbackCourses(query),
    source: 'static_fallback'
  });
});

function getFallbackCourses(query) {
  const topics = query.split(' ').filter(t => t.length > 2);
  const mainTopic = topics[0] || "Professional Development";
  
  // Return a diverse set of 6 courses based on the user's query
  return [
    {
      title: `The Ultimate ${mainTopic} Masterclass`,
      visible_instructors: [{ display_name: "Dr. Angela Yu" }],
      price: "$94.99",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `Master ${mainTopic} from scratch with this comprehensive, hands-on masterclass.`
    },
    {
      title: `Advanced ${mainTopic} & Architecture`,
      visible_instructors: [{ display_name: "Maximilian Schwarzmüller" }],
      price: "$89.99",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `Deep dive into advanced concepts and industry-standard architecture for ${mainTopic}.`
    },
    {
      title: `${topics[1] || mainTopic} for Absolute Beginners`,
      visible_instructors: [{ display_name: "Jose Portilla" }],
      price: "Free",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(topics[1] || mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `A perfect starting point for your journey into ${topics[1] || mainTopic}.`
    },
    {
      title: `100 Days of Code: The ${mainTopic} Bootcamp`,
      visible_instructors: [{ display_name: "Colt Steele" }],
      price: "$19.99",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `Become a developer in 100 days by building real projects every single day.`
    },
    {
      title: `${mainTopic} Performance & Optimization`,
      visible_instructors: [{ display_name: "Kent C. Dodds" }],
      price: "$49.99",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `Learn to build blazing fast, optimized applications with ${mainTopic}.`
    },
    {
      title: `Full Stack ${mainTopic} Specialized Training`,
      visible_instructors: [{ display_name: "Stephen Grider" }],
      price: "$29.99",
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(mainTopic)}`,
      image_480x270: "https://img-c.udemycdn.com/course/480x270/placeholder.jpg",
      headline: `Connect the dots between the frontend and backend using ${mainTopic}.`
    }
  ];
}

module.exports = router;