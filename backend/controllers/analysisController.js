const Analysis = require("../models/Analysis");
const User = require("../models/User");

// SAVE OR UPDATE ANALYSIS
exports.saveAnalysis = async (req, res) => {
  try {
    const { selectedSkills, selectedInterests, experienceLevel } = req.body;

    const userId = req.user.id;

    if (!selectedSkills?.length || !selectedInterests?.length) {
      return res.status(400).json({
        message: "Please select at least one skill and one interest"
      });
    }

    let analysis = await Analysis.findOne({ userId });

    if (analysis) {
      // Update existing
      analysis.selectedSkills = selectedSkills;
      analysis.selectedInterests = selectedInterests;
      analysis.experienceLevel = experienceLevel;
      await analysis.save();
    } else {
      // Create new
      analysis = await Analysis.create({
        userId,
        selectedSkills,
        selectedInterests,
        experienceLevel
      });
    }

    // Update user profileCompleted flag
    await User.findByIdAndUpdate(userId, {
      profileCompleted: true
    });

    res.status(200).json({
      success: true,
      message: "Analysis saved successfully",
      analysis
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// GET LOGGED-IN USER ANALYSIS
exports.getMyAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const analysis = await Analysis.findOne({ userId });

    if (!analysis) {
      return res.status(404).json({
        message: "No analysis found"
      });
    }

    res.status(200).json({
      success: true,
      analysis
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
