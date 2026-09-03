import { Router } from "express";
import { getNotes, createNote, getNoteById, updateNote, deleteNote } from "../controllers/note.controller.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createNoteValidator
} from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
const router=Router()
router.use(verifyJWT)

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRole), getNotes)
  .post(
    createNoteValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(AvailableUserRole), getNoteById)
  .put(
    createNoteValidator(),
    validate,
    validateProjectPermission([UserRolesEnum.ADMIN]),
    updateNote,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);
export default router