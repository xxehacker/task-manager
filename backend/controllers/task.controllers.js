const Task = require("../models/task.model");
const User = require("../models/user.model");

const getAllTasks = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while getting tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while getting task",
    });
  }
};

const updateTaskById = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while updating task",
    });
  }
};

const deleteTaskById = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while deleting task",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      attachments,
      todoChecklist,
      progress,
    } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!Array.isArray(assignedTo)) {
      return res.status(400).json({
        message: "assignedTo should be an array of user ids",
      });
    }

    const createdTask = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      createdBy: req.user._id,
      attachments,
      todoChecklist,
      progress,
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while creating task",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while updating task",
    });
  }
};

const updateTaskChecklist = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while updating task",
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message:
        error?.message || "Something went wrong while getting dashboard data",
    });
  }
};

const getUserDashboardData = async (req, res) => {
  try {
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message:
        error?.message ||
        "Something went wrong while getting user dashboard data",
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  createTask,
  updateTaskStatus,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
