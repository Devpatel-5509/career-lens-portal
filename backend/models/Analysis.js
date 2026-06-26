const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true   // IMPORTANT
    },
    selectedSkills: {
      type: [String],
      default: []
    },
    selectedInterests: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      default: "Beginner"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", AnalysisSchema);
