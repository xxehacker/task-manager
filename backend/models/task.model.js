const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In-progress", "Completed"],
      default: "Pending",
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attachments: [
      {
        type: String,
      },
    ],
    todoChecklist: [todoSchema],
    prograss: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;