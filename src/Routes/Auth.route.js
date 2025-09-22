import express from "express";
import {
  Login,
  SignUp,
  VerifyUser,
  Logout,
} from "../Controllers/Auth.controller.js";
import validator from "../Middlewares/Validate.js";
import {
  SignUpValidator,
  SinginValidator,
  VerificationTokenValidator,
} from "../Validators/Auth.validator.js";

const router = express.Router();

router.get("/login", SinginValidator, validator, Login);
router.post("/Singup", SignUpValidator, validator, SignUp);
router.post("/logout", Logout);
router.get("/verify/:token", VerificationTokenValidator, validator, VerifyUser);
export default router;
