const express = require("express");
const axios = require("axios");
const router = express.Router();
const Recommendation = require("../models/Recommendation");
const Groq = require("groq-sdk");

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// Generate AI Career Paths based on user analysis
router.post("/career-paths", async (req, res) => {
  const { selectedSkills, selectedInterests, experienceLevel } = req.body;

  if (!groq) {
    return res.status(503).json({ message: "AI Service not configured" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a career strategy expert. Given a user's skills, interests, and experience, suggest 1 distinct, high-growth career path that heavily leverages their specific skills. 
          Respond ONLY with a JSON object containing a 'paths' array with exactly 1 object. 
          The path object MUST have: 
          - title: Professional job title
          - match: Match percentage (number 0-100)
          - salary: Realistic salary range string
          - demand: Growth demand (e.g. "High", "Critical", "Explosive")
          - growth: Growth percentage string (e.g. "+35%")
          - timeline: Average time to reach job-ready status
          - description: A compelling 1-2 sentence description
          - roadmapSteps: An array of 5-7 clear learning milestones
          - skillsNeeded: An array of 4-5 technical skills to learn
          - companies: An array of 4-5 top companies hiring for this
          - resources: An array of 3 objects { name, url, type } where type is "Course", "Platform", or "Resource"
          - certifications: An array of 2-3 globally recognized certifications
          Ensure the recommendation is highly tailored to the provided skills. Use a professional, encouraging tone.`
        },
        {
          role: "user",
          content: `Generate 1 career path for these specific characteristics: \nSkills: ${selectedSkills.join(", ")}, \nInterests: ${selectedInterests.join(", ")}, \nExperience: ${experienceLevel}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    const responseContent = JSON.parse(responseText);
    
    // Robustly find the paths array
    const paths = responseContent.paths || responseContent.results || responseContent.careers || Object.values(responseContent).find(Array.isArray) || [];
    
    res.json({ paths });

  } catch (error) {
    console.error("Groq Career Paths Error:", error.message);
    res.status(500).json({ message: "Failed to generate AI career paths", error: error.message });
  }
});

router.post("/recommend", async (req, res) => {
  const { skills } = req.body;
// ... (rest of the file)

  try {
    const query = skills.join(" ");

    const response = await axios.get(
      `http://localhost:5000/api/courses/search-courses?query=${query}`
    );

    // Save recommendation in MongoDB
    await Recommendation.create({
      userId: req.user?.id || "guest",
      skills,
      results: response.data
    });

    res.json(response.data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Recommendation failed" });
  }
});

module.exports = router;