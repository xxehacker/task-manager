const Task = require("../models/task.model");

const getAllTasks = async (req, res) => {
  try {
    const { status } = req.query;

    // Build the filter object
    const filter = {};
    if (status) {
      filter.status = status;
    }

    let tasks;
    // Admin can see all tasks
    // populate meaning: populate the assignedTo field with the username, email and profileImageURL . its mean that we want to display only the username, email and profileImageURL of the user who is assigned to the task
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "username email profileImageURL"
      );
    } else {
      // Non-admin users can only see their own tasks
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "username email profileImageURL"
      );
    }
    // console.log("tasks", tasks);

    // Add completed todoChecklist count to each task
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );
    // console.log("completed todoChecklist count", tasks);

    // Count all tasks (based on user role)
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    // If the user is an admin, count all tasks
    // If the user is not admin, count only tasks assigned to them
    // console.log("all tasks", allTasks);

    // Status-based task counts
    const pendingTasks = await Task.countDocuments({
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    // If the user is an admin, count all pending tasks.
    // If the user is not admin, count only pending tasks assigned to them
    // console.log("pending tasks", pendingTasks);

    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    // console.log("in progress tasks", inProgressTasks);

    const completedTasks = await Task.countDocuments({
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    // console.log("completed tasks", completedTasks);

    // Send final response
    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while getting tasks",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(id).populate(
      "assignedTo",
      "username email profileImageURL"
    );

    return res.status(200).json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while getting task",
    });
  }
};

const updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      todoChecklist,
      attachments,
      assignedTo,
      progress,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (assignedTo) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({
          message: "assignedTo should be an array of user ids",
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title: title || task.title,
        description: description || task.description,
        dueDate: dueDate || task.dueDate,
        priority: priority || task.priority,
        status: status || task.status,
        todoChecklist: todoChecklist || task.todoChecklist,
        attachments: attachments || task.attachments,
        assignedTo: assignedTo || task.assignedTo,
        progress: progress || task.progress,
      },
      {
        new: true, // return the updated document
      }
    );

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
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
