import express from "express";
import { Login ,SignUp } from "../Controllers/Auth.controller.js";
import validator from "../Middlewares/Validate.js";
import {SignUpValidator} from "../Validators/Auth.validator.js";

const router = express.Router();

router.get("/login", Login);
router.post("/Singup", SignUpValidator , validator, SignUp)
export default router;
