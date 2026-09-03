import fs from "node:fs/promises";
import path from "node:path";

import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, username } = req.body;

  if (username !== undefined && !username.trim()) {
    throw new ApiError(400, "Username cannot be empty");
  }

  const updates = {};

  if (fullName !== undefined) {
    updates.fullName = fullName.trim();
  }

  if (username !== undefined) {
    updates.username = username.trim().toLowerCase();
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No profile fields provided");
  }

  if (updates.username) {
    const existingUser = await User.findOne({
      username: updates.username,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      throw new ApiError(409, "Username is already taken");
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  ).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar image is required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const oldLocalPath = user.avatar?.localPath;

  const avatarUrl = `/images/${req.file.filename}`;

  user.avatar = {
    url: avatarUrl,
    localPath: req.file.path,
  };

  await user.save({ validateBeforeSave: false });

  // Delete the previous uploaded avatar.
  // Don't delete the default placeholder.
  if (oldLocalPath) {
    try {
      await fs.unlink(path.resolve(oldLocalPath));
    } catch (error) {
      // Ignore if the old file no longer exists.
      if (error.code !== "ENOENT") {
        console.error("Failed to delete old avatar:", error);
      }
    }
  }

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

export { updateProfile, updateAvatar };
