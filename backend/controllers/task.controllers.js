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
      status: "inProgress",
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      task: task._id,
    });
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
    const { id } = req.params;
    const { status } = req.body;

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

    // Check if the user is assigned to the task : why this check ? because if the user is not assigned to the task then he can't update the status of the task
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    console.log("isAssigned", isAssigned);

    // Check if the user is admin : why this check ? because if the user is not admin then he can't update the status of the task
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not assigned to this task",
      });
    }

    task.status = status || task.status;

    if (task.status === "completed") {
      task.todoChecklist.forEach((item) => (item.isCompleted = true));
      task.progress = 100;
    }

    await task.save();

    return res.status(200).json({
      message: "Status updated successfully",
      task,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while updating task",
    });
  }
};

const updateTaskChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { todoChecklist } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Task ID is required",
      });
    }

    if (!todoChecklist) {
      return res.status(400).json({
        message: "todoChecklist is required",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check if the user is assigned to the task and user is not admin then he can't update the status of the task
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not assigned to this task",
      });
    }

    task.todoChecklist = todoChecklist;

    // auto udpate progress based on checklist completion
    const completedCount = task.todoChecklist.filter(
      (item) => item.isCompleted
    ).length; // this is the number of items that are completed (basically the number of true values in the isCompleted array)
    // console.log("completedCount", completedCount);
    const totalItems = task.todoChecklist.length; // this is the total number of items in the isCompleted array
    // console.log("totalItems", totalItems);

    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // auto update status based on progress
    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "inProgress";
    } else {
      task.status = "pending";
    }

    await task.save();

    const updatedTask = await Task.findById(id).populate(
      "assignedTo",
      "username email profileImageURL"
    );

    return res.status(200).json({
      message: "Checklist updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while updating task",
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const inProgressTasks = await Task.countDocuments({
      status: "inProgress",
    });
    const overdueTasks = await Task.countDocuments({
      status: { $ne: "completed" }, // ne: not equal
      dueDate: { $lt: new Date() }, // lt: less than
    }); // note: overdue tasks are tasks that are not completed and their due date is less than the current date

    //* Ensure all possible statuses are included
    const taskStatuses = ["pending", "inProgress", "completed"];
    // note:  aggregate: this is a mongoDB method that allows you to perform complex queries on your database without having to write a separate query for each operation. In this case, we are using it to get the distribution of tasks by status (pending, in-progress, completed)
    const taskDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]); // note: this is an array of objects that contains the distribution of tasks by status
    console.log("taskDistributionRaw", taskDistributionRaw);

    // note: taskDistribution is an object that contains the distribution of tasks by status
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formatedKey = status.replace(/\s+/g, ""); // remove spaces
      acc[formatedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0; // find the item in the array that has the same _id as the status
      return acc;
    }, {});
    console.log("taskDistribution", taskDistribution);

    taskDistribution["All"] = totalTasks;

    //* Ensure all priorities are included
    // note: priorityDistributionRaw is an array of objects that contains the distribution of tasks by priority (low, medium, high)
    const priorityDistributionRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    console.log("priorityDistributionRaw", priorityDistributionRaw);

    // note: taskPriorityLevel is an object that contains the distribution of tasks by priority
    const taskPriorityLevel = ["low", "medium", "high"].reduce(
      (acc, priority) => {
        acc[priority] =
          priorityDistributionRaw.find((item) => item._id === priority)
            ?.count || 0;
        return acc;
      },
      {}
    );
    console.log("taskPriority", taskPriorityLevel);

    //* Fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 }) //* sort by createdAt field in descending order
      .limit(10) ///* limit to 10 tasks
      .select("title sstatus priority dueDate createdAt"); //* select only the fields we need

    return res.status(200).json({
      message: "Dashboard data fetched successfully",
      statistics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    });
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
    const userId = req.user._id;
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "pending",
    });
    const inProgressTasks = await Task.countDocuments({
      assignedTo: userId,
      status: "inProgress",
    });
    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      status: { $ne: "completed" }, // ne: not equal
      dueDate: { $lt: new Date() }, // lt: less than
    }); // note: overdue tasks are tasks that are not completed and their due date is less than the current date

    //* task distribution by status
    const taskStatuses = ["pending", "inProgress", "completed"];

    // note: taskDistributionRaw is an array of objects that contains the distribution of tasks by status . We use aggregate method to match the tasks that are assigned to the user and group them by status
    const taskDistributionRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
      // note: replace spaces with empty string
      const formatedKey = status.replace(/\s+/g, "");
      acc[formatedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0; //* find the item in the array that has the same _id as the status
      return acc;
    }, {});

    taskDistribution["All"] = totalTasks;

    // note: priorityDistributionRaw is an array of objects that contains the distribution of tasks by priority (low, medium, high)
    const taskPriorities = ["low", "medium", "high"];
    const priorityDistributionRaw = await Task.aggregate([
      {
        $match: {
          assignedTo: userId,
        },
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        priorityDistributionRaw.find((item) => item._id === priority)?.count ||
        0;
      return acc;
    }, {});

    //* fetch recent 10 tasks
    const recentTasks = await Task.find({ assignedTo: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    return res.status(200).json({
      message: "User dashboard data fetched successfully",
      statistics: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks,
      },
      charts: {
        taskDistribution,
        taskPriorityLevel,
      },
      recentTasks,
    });
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
