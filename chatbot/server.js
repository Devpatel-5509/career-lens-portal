import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const API_KEY = "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";

// conversation memory
let conversationHistory = [];
const MAX_HISTORY = 10;

app.post("/chat", async (req, res) => {

    try {

        const message = req.body.message;

        // save user message
        conversationHistory.push({
            role: "user",
            content: message
        });

        // limit conversation history
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

Your job is to help students with:
• careers
• courses
• colleges
• study guidance

Response Rules:

1. Answer exactly what the user asks.
2. Keep answers SHORT and DIRECT.
3. Use maximum 3–5 lines for most questions.
4. Do NOT give step-by-step instructions unless the user asks "how to".
5. Avoid long explanations.
6. If the user asks for more details, then provide a longer explanation.

Examples:

User: Machine learning course

Answer:
Recommended courses:
• Andrew Ng Machine Learning – Coursera
• Google Machine Learning Crash Course
• Deep Learning Specialization – Coursera

User: How to start machine learning?

Answer can be longer with steps.

Always keep responses clear, short, and relevant.
`
                    },

                    ...conversationHistory
                ],

                max_tokens: 600,
                temperature: 0.5
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        // save AI response
        conversationHistory.push({
            role: "assistant",
            content: reply
        });

        res.json({
            reply: reply
        });

    } catch (error) {

        console.log("REAL ERROR:", error.response?.data || error.message);

        res.json({
            reply: "⚠️ AI service error. Please try again."
        });

    }

});

app.listen(3001, () => {
    console.log("Server running at http://localhost:3000");
});