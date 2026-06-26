const express = require("express");
const axios = require("axios");
const router = express.Router();

// Adzuna API details
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

router.get("/search-jobs", async (req, res) => {
  const { query, location = 'us', page = 1 } = req.query;

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    console.warn("Adzuna API keys missing, returning fallback data");
    return res.json({ 
      results: getFallbackJobs(query),
      source: 'fallback'
    });
  }

  try {
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${location}/search/${page}`,
      {
        params: {
          app_id: ADZUNA_APP_ID,
          app_key: ADZUNA_APP_KEY,
          what: query,
          results_per_page: 50,
          content_type: 'application/json'
        }
      }
    );

    res.json({
      results: response.data.results,
      source: 'api'
    });
  } catch (error) {
    console.error("Adzuna API Error:", error.message);
    res.status(500).json({
      message: "Error fetching jobs",
      error: error.message,
      results: getFallbackJobs(query) // Fallback on error
    });
  }
});

// Fallback data generator to prevent app from breaking if API fails or keys missing
function getFallbackJobs(query) {
  const jobQuery = query || "Developer";
  return [
    {
      id: "fb1",
      title: `Senior ${jobQuery} Engineer`,
      company: { display_name: "Tech Solutions Inc." },
      location: { display_name: "Remote" },
      salary_min: 130000,
      salary_max: 180000,
      description: `A senior role focusing on ${jobQuery} and modern frameworks.`,
      redirect_url: "https://www.adzuna.com"
    },
    {
      id: "fb2",
      title: `${jobQuery} Developer`,
      company: { display_name: "Innovative Startup LLC" },
      location: { display_name: "New York, NY" },
      salary_min: 90000,
      salary_max: 130000,
      description: `Join our fast-paced team to build products utilizing ${jobQuery}.`,
      redirect_url: "https://www.adzuna.com"
    },
    {
      id: "fb3",
      title: `Lead ${jobQuery} Architect`,
      company: { display_name: "Global Enterprises" },
      location: { display_name: "San Francisco, CA" },
      salary_min: 150000,
      salary_max: 200000,
      description: `Lead complex architectures and mentor engineers in ${jobQuery}.`,
      redirect_url: "https://www.adzuna.com"
    },
    {
      id: "fb4",
      title: `Junior ${jobQuery} Specialist`,
      company: { display_name: "Creative Agency" },
      location: { display_name: "Remote" },
      salary_min: 60000,
      salary_max: 85000,
      description: `Great entry-level opportunity to improve your ${jobQuery} skills.`,
      redirect_url: "https://www.adzuna.com"
    },
    {
      id: "fb5",
      title: `${jobQuery} Consultant`,
      company: { display_name: "FinTech Partners" },
      location: { display_name: "Chicago, IL" },
      salary_min: 110000,
      salary_max: 140000,
      description: `Consulting role requiring strong ${jobQuery} knowledge and client-facing skills.`,
      redirect_url: "https://www.adzuna.com"
    }
  ];
}

module.exports = router;
