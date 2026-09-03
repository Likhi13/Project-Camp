import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  //encoded token grab from req
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  //if no token throw unauth
  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  //decoding the token using jwt module's verify(encoded token, secret) method
  //and throw error is user w the token not found
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    //attaching user object to req.user
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
export const validateProjectPermission = (roles = []) => {
  return asyncHandler(async (req, res,next) => {
    const { projectId } = req.params;
    if (!projectId) {
      throw new ApiError(400, "Project id is missing");
    }
    const project = await ProjectMember.findOne({
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(req.user._id),
    });
    if (!project) {
      throw new ApiError(400, "Project missing");
    }
    const givenRole=project?.role
    req.user.role=givenRole

   if (!roles.includes(givenRole)){
    throw new ApiError(403,"You don't have permission to perform this action")
  
   }
   next()
  });
};
