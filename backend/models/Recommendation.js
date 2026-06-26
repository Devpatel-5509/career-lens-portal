const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  userId: String,
  skills: [String],
  results: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Recommendation", recommendationSchema);