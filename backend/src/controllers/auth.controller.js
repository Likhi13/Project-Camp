import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import {
  emailVerifContent,
  forgotPswdfContent,
  sendEmail,
} from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    //don't need to  do validation again since touched only one field which doesnr concern validation
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //object destructuring assignment
  const { email, username, password, role } = req.body;

  //DB operation - find user w username/email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  //check fr existing user
  if (existingUser) {
    throw new ApiError(409, "User with email/username already exists", []);
  }

  //save user to DB(DB operation)
  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  //generate temporary token
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  //verifying email

  //grab hashedtoken and tokenexpiry and assign to user
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  //save  w/o validation
  await user.save({ validateBeforeSave: false });

  //send the Email
  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    //generate a dynamic link from request
    mailgenContent: emailVerifContent(
      user.username,
      `${process.env.EMAIL_VERIFICATION_REDIRECT_URL}/${unHashedToken}`,
    ),
  });

  //i want the created user info w/o some fields as all r by default sent
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  //if user doesnt exist throw error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //return response
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  //login using email+pswd
  const { email, password, username } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  //find user by email n if not exist throw error
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User doesn't exist");
  }

  //check if pswd is matching
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid credentials");
  }

  //generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  //only sending specific fields in request
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  //store tokens in cookies
  //cookies need options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //in auth middleware we did req.user=user and passed it in route b4 execution of logout func
  //remove traces in DB by updating
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: "" } },

    //to give the updated/newer object
    { returnDocument: "after" },
  );

  //set options for cookie clearing
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// const getCurrentUser=asyncHandler(async(req,res)=>{})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;
  if (!verificationToken) {
    throw new ApiError(400, "Email verification token is missing");
  }
  //hash the token again as we are not saving unhashed token in the DB so it is not secure
  //that token only passed as url param should be hashed when sending it to user
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  //above hashedToken gives the same hashedToken as the one stored in Db
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    // If the expiry time is greater than the current timestamp, the token is valid
    emailVerificationExpiry: { $gt: Date.now() },
  });
  if (!user) {
    throw new ApiError(400, "Token is invalid or  expired");
  }

  //if token is valid then just turn verfy flag true and save to DB
  user.isEmailVerified = true;

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, "Email is Verified"));
});

//user is not able to verify 1st time, so resend it
const resendEmailVerification = asyncHandler(async (req, res) => {
  //secured route so check first user is logged in
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
  if (user.isEmailVerified) {
    throw new ApiError(409, "Email is already verified");
  }
  //grab tokens
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  //assign to user object
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  //save to DB
  await user.save({ validateBeforeSave: false });

  //send email
  await sendEmail({
    email: user?.email,
    subject: "Please verify your emmail",
    mailgenContent: emailVerifContent(
      user.username,
      `${process.env.EMAIL_VERIFICATION_REDIRECT_URL}/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email id"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //grab old token
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  //check if exists or unauth
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    //decode token
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    //Also must match w db  token
    //ensures that only the most recent refresh token is valid, and all previous ones are invalidated.
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired");
    }

    //options for cookie
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    //generate access token based on id
    //Take the property refreshToken from the returned object.Store it in a variable named newRefreshToken.

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPswdfContent(
      user.username,
      `${process.env.FORGOT_PSWD_REDIRECT_URL}/${unHashedToken}`,
    ),
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});

const resetForgotPassword = asyncHandler(async (req, res) => {
  //from parameters grab reset token n ne pswd from form
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  //hash the token
  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //find user matching that token and within expiry
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token is invalid or expired");
  }
  //clean fields
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  //assign pswd
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

//secure route
const changeCurrentPassword = asyncHandler(async (req, res) => {
  //take user input
  const { oldPassword, newPassword } = req.body;
  //find user
  const user = await User.findById(req.user?._id);

  //check if old pswd crct
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed succcessfully"));
});

export {
  registerUser,
  login,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgotPassword,
  changeCurrentPassword,
};
