const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 ROUTES (MUST BE BEFORE app.listen)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/recommendation", require("./routes/recommendationRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
