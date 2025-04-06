const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6 || "Password must be at least 6 characters long",
      max: 40 || "Password must be at most 40 characters long",
    },
    profileImageURL: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
