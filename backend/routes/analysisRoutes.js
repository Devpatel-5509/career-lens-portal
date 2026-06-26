const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

// @route   POST /api/analysis/save-analysis
// @desc    Save user's analysis data (skills, interests, experience)
// @access  Private
router.post('/save-analysis', auth, async (req, res) => {
  try {
    const { selectedSkills, selectedInterests, experienceLevel } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!selectedSkills || !selectedInterests || !experienceLevel) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: skills, interests, and experience level' 
      });
    }

    // Check if analysis already exists for this user
    let analysis = await Analysis.findOne({ userId });

    if (analysis) {
      // Update existing analysis
      analysis.selectedSkills = selectedSkills;
      analysis.selectedInterests = selectedInterests;
      analysis.experienceLevel = experienceLevel;
      
      await analysis.save();
      
      return res.json({ 
        message: 'Analysis updated successfully', 
        analysis 
      });
    } else {
      // Create new analysis
      analysis = new Analysis({
        userId,
        selectedSkills,
        selectedInterests,
        experienceLevel
      });

      await analysis.save();
      
      return res.status(201).json({ 
        message: 'Analysis saved successfully', 
        analysis 
      });
    }
  } catch (error) {
    console.error('Error saving analysis:', error.message);
    res.status(500).json({ message: 'Server error while saving analysis' });
  }
});

// @route   GET /api/analysis/get-my-analysis
// @desc    Get current user's analysis
// @access  Private
router.get('/get-my-analysis', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const analysis = await Analysis.findOne({ userId });
    
    if (!analysis) {
      return res.status(404).json({ 
        message: 'No analysis found for this user' 
      });
    }

    res.json({ analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error.message);
    res.status(500).json({ message: 'Server error while fetching analysis' });
  }
});

// @route   DELETE /api/analysis/delete-analysis
// @desc    Delete user's analysis
// @access  Private
router.delete('/delete-analysis', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Analysis.findOneAndDelete({ userId });
    
    res.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Error deleting analysis:', error.message);
    res.status(500).json({ message: 'Server error while deleting analysis' });
  }
});

module.exports = router;