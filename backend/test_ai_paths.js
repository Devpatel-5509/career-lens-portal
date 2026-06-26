const Groq = require("groq-sdk");
require("dotenv").config();

async function testGroqCareerPaths() {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY missing in .env");
    return;
  }

  const groq = new Groq({ apiKey: GROQ_API_KEY });
  const selectedSkills = ["Python", "Animation"];
  const selectedInterests = ["Gaming"];
  const experienceLevel = "Beginner";

  console.log("🚀 Testing Groq Career Path Generation...");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a career strategy expert. Given a user's skills, interests, and experience, suggest 3 distinct, high-growth career paths. Respond ONLY with a JSON object containing a 'paths' array. Each path object MUST have: title, match (number 0-100), salary (string), demand (string), growth (string), timeline (string), description (string), and roadmapSteps (array of 5-7 strings). Use professional tone."
        },
        {
          role: "user",
          content: `Skills: ${selectedSkills.join(", ")}, Interests: ${selectedInterests.join(", ")}, Experience: ${experienceLevel}`
        }
      ],
      model: "mixtral-8x7b-32768",
      response_format: { type: "json_object" }
    });

    const rawContent = chatCompletion.choices[0].message.content;
    console.log("📦 Raw AI Content:", rawContent);

    try {
      const responseContent = JSON.parse(rawContent);
      console.log("✅ JSON Parse Successful");
      const paths = responseContent.paths || responseContent.results || Object.values(responseContent)[0];
      
      if (Array.isArray(paths)) {
        console.log(`✨ Found ${paths.length} career paths!`);
        paths.forEach(p => console.log(` - ${p.title}`));
        
        if (paths.length > 0 && paths[0].title.toLowerCase().includes("senior full stack")) {
          console.log("⚠️ WARNING: AI is still returning the 'Full Stack' default. Prompt might need adjustment.");
        }
      } else {
        console.log("❌ Error: No 'paths' array found in response.");
      }
    } catch (e) {
      console.log("❌ JSON Parse Failed:", e.message);
    }

  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
  }
}

testGroqCareerPaths();
