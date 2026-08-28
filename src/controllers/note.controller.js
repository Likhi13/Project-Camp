import { Project } from "../models/project.models.js";
import { projectNote } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";

const getNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await projectNote
    .find({ project: new mongoose.Types.ObjectId(projectId) })
    .populate("createdBy", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});
const createNote = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await projectNote.create({
    project: projectId,
    createdBy: req.user._id,
    content: content,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});
const getNoteById = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const noteDetails = await projectNote.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(noteId),
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projectDetails",
        pipeline: [
          {
            $project: {
              name: 1,
              description: 1,
              createdBy: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$projectDetails",
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "userDetails",
        pipeline: [
          {
            $project: {
              avatar: 1,
              username: 1,
              fullName: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        content: 1,
        projectDetails: 1,
        userDetails: 1,
      },
    },
  ]);

  if (!noteDetails.length) {
    throw new ApiError(404, "Note doesn't exist");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        noteDetails[0],
        "Project Note details fetched successfully",
      ),
    );
});
const updateNote = asyncHandler(async (req, res) => {
  const { projectId, noteId } = req.params;
  const { content } = req.body;

  const updatedNote = await projectNote.findOneAndUpdate(
    { _id: noteId, project: projectId },
    { $set: { content: content } },
    { new: true, runValidators: true },
  );
  if (!updatedNote) {
    throw new ApiError(404, "Note doesn't exist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});
const deleteNote = asyncHandler(async (req, res) => {
  const {projectId,noteId}=req.params
  const deletedNote=await projectNote.findOneAndDelete({_id:noteId,project:projectId})
  if(!deletedNote){
    throw new ApiError(404,"Note doesn't exist")
  }
  return res.status(200).json(new ApiResponse(200,deletedNote,"Note deleted successfully"))
});

export { getNotes, createNote, getNoteById, updateNote, deleteNote };
