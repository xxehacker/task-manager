const express = require("express");
const { protected , adminProtected } = require("../middlewares/auth.middleware");

const {
    getDashboardData,
    getUserDashboardData,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    createTask,
    updateTaskStatus,
    updateTaskChecklist
} = require("../controllers/task.controllers.js");

const router = express.Router();

router.route("/dashboard-data").get(protected, getDashboardData);
router.route("/user-dashboard-data").post(protected, getUserDashboardData);
router.route("/").get(protected, getAllTasks);
router.route("/get:id").get(protected, getTaskById);
router.route("/update:id").put(protected, updateTaskById);
router.route("/delete:id").delete(protected, adminProtected , deleteTaskById);
router.route("/create").post(protected, adminProtected, createTask);
router.route("/:id/status").put(protected, adminProtected, updateTaskStatus);
router.route("/:id/todo").put(protected, adminProtected, updateTaskChecklist);

module.exports = router;
