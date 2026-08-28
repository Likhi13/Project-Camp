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

const router=Router()
router.use(verifyJWT)

router
.route("/:projectId")
.get(validateProjectPermission(["ADMIN","PROJECT_ADMIN","MEMBER"]),getNotes)
.post(createNoteValidator(),validate,validateProjectPermission(["ADMIN"]),createNote)

router
.route("/:projectId/n/:noteId")
.get(validateProjectPermission(["ADMIN","PROJECT_ADMIN","MEMBER"]),getNoteById)
.put(createNoteValidator(),validate,validateProjectPermission(["ADMIN"]),updateNote)
.delete(validateProjectPermission(["ADMIN"]),deleteNote)

export default router