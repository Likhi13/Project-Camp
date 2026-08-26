import { application, Router } from "express";
import {
  createSubTask,
  createTask,
  deleteTask,
  deleteSubTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
} from "../controllers/task.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createTaskValidator,
  createSubTaskValidator,
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);
router
  .route("/:projectId")
  .get(
    validateProjectPermission(["ADMIN", "PROJECT_ADMIN", "MEMBER"]),
    getTasks,
  )
  .post(
    upload.array("files"),
    createTaskValidator(),
    validate,
    validateProjectPermission(["ADMIN", "PROJECT_ADMIN"]),
    createTask,
  );
router
  .route("/:projectId/t/:taskId")
  .get(
    validateProjectPermission(["ADMIN", "PROJECT_ADMIN", "MEMBER"]),
    getTaskById,
  )
  .put(
    upload.array("files"),
    validateProjectPermission(["ADMIN", "PROJECT_ADMIN"]),
    updateTask,
  )
  .delete(validateProjectPermission(["ADMIN", "PROJECT_ADMIN"]), deleteTask);

router
  .route("/:projectId/t/:taskId/subtasks")
  .post(
    createSubTaskValidator(),
    validate,
    validateProjectPermission(["ADMIN", "PROJECT_ADMIN"]),
    createSubTask,
  );
router
  .route("/:projectId/st/:subTaskId")
  .put(validateProjectPermission(["ADMIN", "PROJECT_ADMIN", "MEMBER"]))
  .delete(validateProjectPermission(["ADMIN", "PROJECT_ADMIN"]), deleteSubTask);
export default router;
