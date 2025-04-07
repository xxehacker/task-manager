const User = require("../models/user.model");
const Task = require("../models/task.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    // console.log("users", users);

    //! add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "inProgress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    return res.status(200).json({
      message: "Users fetched successfully",    
      users: usersWithTaskCounts,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: error?.message || "Something went wrong while getting users",
    });
  }
};

const getUserById = async (req, res) => {};

const deleteUserById = async (req, res) => {};

module.exports = { getAllUsers, getUserById, deleteUserById };
