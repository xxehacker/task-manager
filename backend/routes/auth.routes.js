const express = require("express");
const { protected } = require("../middlewares/auth.middleware");

const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/auth.controllers");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(protected, getUserProfile);
router.route("/update-profile").put(protected, updateUserProfile);

module.exports = router;
