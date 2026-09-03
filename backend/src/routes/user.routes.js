import { Router } from "express";

import { updateProfile, updateAvatar } from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/profile").patch(updateProfile);

router.route("/avatar").patch(upload.single("avatar"), updateAvatar);

export default router;
