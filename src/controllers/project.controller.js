import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js";
import { ProjectMemeber } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import mongoose from "mongoose";
import {
  emailVerifContent,
  forgotPswdfContent,
  regularTemplate,
  sendEmail,
} from "../utils/mail.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { pipeline } from "nodemailer/lib/xoauth2/index.js";

const getProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectMemeber.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectMembers",
            },
          },
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },
    {
      $unwind: "$projects",
    },
    {
      $project: {
        projects: {
          _id: 1,
          name: 1,
          desc: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asyncHandler(async (req, res) => {
  //grab name and desc
  const { name, description } = req.body;

  //create project doc
  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  //upgrade the member as  an admin of  the project
  await ProjectMemeber.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id),
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  //upate name or desc,  grab project id from url
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    {
      name,
      description,
    },
    { new: true },
  );
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return (
    res.status(200),
    json(new ApiResponse(200, project, "project updated successfully"))
  );
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const projectId = req.params;
  const project = await Project.findById(req.params);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const projectMembers = await ProjectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
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
        user: {
          $arrayElemAt: ["$user", 0],
        },
      },
    },
    {
      $project: {
        project: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, projectMembers, "Project members fetched"));
});

const addMembersToProject = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User doesn't  exist");
  }
  if (!project) {
    throw new ApiError(404, "Project doesn't exist");
  }

  await ProjectMemeber.findByIdAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    { new: true, upsert: true },
  );
  await sendEmail({
    email: user.email,
    subject: `You have been added to the project "${project.name}" as a ${role}.`,
    mailgenContent: regularTemplate(
      user.username,
      `Congrats!!🎉, You have been added to ${project.name}. Looking forward for to work with you.`,
    ),
  });
  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully"));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const {role:newRole }= req.body;
  const { projectId, userId } = req.params;
  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid Role");
  }

  const user = await User.findById(userId);
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project doesn't exist");
  }

    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

  const projectMember = await ProjectMemeber.findOne({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }
  const updatedMember = await ProjectMemeber.findByIdAndUpdate(
    projectMember._id,
    {
      role: newRole,
    },
    { new: true },
  );
  await sendEmail({
    email: user.email,
    subject: `Your role has been updated to ${newRole}.`,
    mailgenContent: regularTemplate(
      user.username,
      `Your role in the ${project.name} has been updated to ${newRole}. Looking forward for your amazing work`,
    ),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMember,
        "Project Member role successfully updated",
      ),
    );
});

const deleteMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  const user = await User.findById(userId);
  const project = await Project.findById(projectId);

    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

  if (!project) {
    throw new ApiError(404, "Project doesn't exist");
  }
  const projectMember = await ProjectMemeber.findOne({
    user: new mongoose.Types.ObjectId(userId),
    project: new mongoose.Types.ObjectId(projectId),
  });
  if (!projectMember) {
    throw new ApiError(400, "Project member not found");
  }
  const deletedMember = await ProjectMemeber.findByIdAndDelete(projectMember._id);
  await sendEmail({
    email: user.email,
    subject: `You have been removed from a project.`,
    mailgenContent: regularTemplate(
      user.username,
      `You have been removed from the ${project.name}.`,
    ),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedMember,
        "Member succcessfully removed from the project",
      ),
    );
});

export {
  addMembersToProject,
  createProject,
  deleteMember,
  getProjectById,
  getProjects,
  getProjectMembers,
  updateProject,
  deleteProject,
  updateMemberRole,
};
