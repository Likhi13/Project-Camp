import { ExpressValidator, validationResult } from "express-validator";
import { ApiError } from "../utils/api-error.js";

// file->extract errors->process them
export const validate = (req, res, next) => {
  //catch any errors in request
  //it checks whether any of the validator middlewares 
  // (from userRegisterValidator()) added errors to the request object.
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }
  //extract error into arr so ppl can read
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  throw new ApiError(422, "Recieved data is not valid", extractedErrors);
};
