import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));


/* ==============================
        API KEYS
============================== */

const GROQ_API_KEY = "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";
const RAPID_API_KEY = "8f2e91e294mshd72a6aba9653c34p126c1cjsn1df9acdea78a";


/* ==============================
        CHAT MEMORY
============================== */

let conversationHistory = [];
const MAX_HISTORY = 10;


/* ==============================
        CHATBOT ROUTE
============================== */

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        if (!message) {
            return res.json({ reply: "Please ask a question." });
        }

        conversationHistory.push({
            role: "user",
            content: message
        });

        if (conversationHistory.length > MAX_HISTORY) {
            conversationHistory.shift();
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",

                messages: [
                    {
                        role: "system",
                        content: `
You are CareerLens AI, a smart career and education assistant.

Help students with:
• careers
• courses
• colleges
• study guidance

Rules:
1. Keep answers SHORT (3–5 lines).
2. Answer exactly what the user asks.
3. Avoid long explanations.
`
                    },

                    ...conversationHistory
                ],

                max_tokens: 500,
                temperature: 0.5
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content || "No response.";

        conversationHistory.push({
            role: "assistant",
            content: reply
        });

        res.json({ reply });

    } catch (error) {

        console.log("CHATBOT ERROR:", error.response?.data || error.message);

        res.json({
            reply: "⚠️ AI service error. Please try again."
        });

    }

});


/* ==============================
        JOB SEARCH ROUTE
        (WITH PAGINATION)
============================== */

app.get("/jobs", async (req, res) => {

    try {

        const role = req.query.role || "Software Developer";
        const location = req.query.location || "India";
        const page = req.query.page || "1";

        console.log("Searching jobs:", role, location, "Page:", page);

        const query = `${role} jobs in ${location}`;

        const response = await axios.get(
            "https://jsearch.p.rapidapi.com/search",
            {
                params: {
                    query: query,
                    page: page,
                    num_pages: "1"
                },
                headers: {
                    "X-RapidAPI-Key": RAPID_API_KEY,
                    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
                }
            }
        );

        const jobs = response.data?.data || [];

        console.log("Jobs found:", jobs.length);

        res.json({
            page: Number(page),
            jobs: jobs
        });

    } catch (error) {

        console.log("JOB API ERROR:", error.response?.data || error.message);

        res.json({
            page: 1,
            jobs: []
        });

    }

});


/* ==============================
        HEALTH CHECK
============================== */

app.get("/health", (req, res) => {
    res.send("CareerLens Server Running 🚀");
});


/* ==============================
        START SERVER
============================== */

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});