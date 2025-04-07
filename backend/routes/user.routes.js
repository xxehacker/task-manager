const express = require("express");
const { protected, adminProtected } = require("../middlewares/auth.middleware");
const {
  getAllUsers,
  getUserById,
  deleteUserById,
} = require("../controllers/user.controllers.js");

const router = express.Router();

// user
router.route("/:id").get(protected, getUserById);

// admin
router.route("/").get(protected, adminProtected, getAllUsers);
router.route("/:id").delete(protected,  adminProtected, deleteUserById);

module.exports = router;
