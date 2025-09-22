import express from "express";
import {
  Login,
  SignUp,
  VerifyUser,
  Logout,
  updateProfile,
} from "../Controllers/Auth.controller.js";
import validator from "../Middlewares/Validate.js";
import {
  SignUpValidator,
  SinginValidator,
  VerificationTokenValidator,
  UpdateProfileValidator,
} from "../Validators/Auth.validator.js";
import AuthMiddleware from "../Middlewares/Auth.middleware.js";

import { upload } from "../Lib/Multer.js";

const router = express.Router();

router.get("/login", SinginValidator, validator, Login);
router.post("/Singup", SignUpValidator, validator, SignUp);
router.post("/logout", Logout);
router.get("/verify/:token", VerificationTokenValidator, validator, VerifyUser);
router.put(
  "/update-profile",
  AuthMiddleware,
  upload.single("File"),
  UpdateProfileValidator,
  validator,
  updateProfile
);
export default router;
