const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String
    },

    password: {
      type: String,
      required: true
    },

    // ✅ NEW FIELD (VERY IMPORTANT)
    profileCompleted: {
      type: Boolean,
      default: false
    },

    // Password reset fields (already existing)
    resetToken: {
      type: String
    },

    resetTokenExpiry: {
      type: Date
    }

  },
  { timestamps: true }   // adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
