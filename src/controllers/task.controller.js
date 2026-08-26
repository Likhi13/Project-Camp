import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

const getTasks = asyncHandler(async (req, res) => {
  //test
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  }).populate("assignedTo", "avatar username FullName");
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks retrieved successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;
  const { projectId } = req.params;
  const files = req.files || [];
  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const assignedBy = req.user._id;
  const assignedToUser = await User.findOne({ email: assignedTo });
  if (!assignedToUser) {
    throw new ApiError(404, "User doesn't exist");
  }
  //test this route will work when status is wrong?
  const newTask = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedToUser._id)
      : undefined,
    assignedBy: new mongoose.Types.ObjectId(assignedBy),
    status,
    attachments,
  });
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        newTask,
        `New Task created successfully for project: ${project.name}`,
      ),
    );
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "task",
        as: "subtasks",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "createdBy",
              foreignField: "_id",
              as: "createdBy",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              createdBy: {
                $arrayElemAt: ["$createdBy", 0],
              },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo", 0],
        },
      },
    },
  ]);
  if (!tasks || task.length === 0) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;
  const files = req.files || [];
  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
  });
  if (!task) {
    throw new ApiError(404, "Task not found in this project");
  }
  const updateData = {};
  //update only fields that were provided
  if (title !== undefined) {
    updateData.title = title;
  }
  if (description !== undefined) {
    updateData.description = description;
  }

  if (assignedTo !== undefined) {
    updateData.assignedTo = new mongoose.Types.ObjectId(assignedTo);
  }

  if (status !== undefined) {
    updateData.status = status;
  }
  //if new files are uploaded
  if (files.length > 0) {
    updateData.attachments = files.map((file) => {
      return {
        url: `${process.env.SERVER_URL}/images/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      };
    });
  }

  const updatedtask = await Task.findByIdAndUpdate(
    new mongoose.Types.ObjectId(taskId),
    {
      $set: updateData,
    },
    { new: true, runValidators: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedtask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(taskId),
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!task) {
    throw new ApiError(404, "Task not found in this project");
  }

  const deletedTask = await Task.findByIdAndDelete(taskId);
  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title } = req.body;

  const task = await Task.findOne({ _id: taskId, project: projectId });
  if (!task) {
    throw new ApiError(404, "Task not found in this project");
  }
  const newSubTask = await SubTask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });
  return res
    .status(201)
    .json(new ApiResponse(201, newSubTask, "SubTask created successfully"));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { projectId, subTaskId } = req.params;
  const { title, isCompleted } = req.body;
  const subTask = await SubTask.findById(subTaskId);
  if (!subTask) {
    throw new ApiError(404, "Subtask not found");
  }
  const task = await Task.findOne({
    _id: new mongoose.Types.ObjectId(subTask.task),
    project: mongoose.Types.ObjectId(projectId),
  });
  if (!task) {
    throw new ApiError(404, "Subtask not found in project");
  }
  const updateData = {};
  if (title !== undefined) {
    updateData.title = title;
  }
  if (isCompleted !== undefined) {
    updateData.isCompleted = isCompleted;
  }
  const updatedSubTask = await SubTask.findByIdAndUpdate(
    subTaskId,
    { $set: updateData },
    { new: true, runValidators: true },
  );
  return res.status(200).json(new ApiResponse(200,updatedSubTask,"Subtask updated successfully"))
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const {projectId,subTaskId}=req.params
  const subTask=await SubTask.findById(subTaskId) 
  if(!subTask){
    throw new ApiError(404,"Subtask not found")
  }
  const task=await Task.findOne(
    {_id:new mongoose.Types.ObjectId(subTask.task),
    project:mongoose.Types.ObjectId(projectId)
    }
  )
  if(!task){
    throw new ApiError(404,"Subtask doesn't belong to the Project")
  }

  const deletedSubTask=await SubTask.findByIdAndDelete(subTaskId)
  return res.status(200).json(new ApiResponse(200,deletedSubTask,"Subtask deleted successfully"))
});

export {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
};
