import { body } from "express-validator";

const SignUpValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  body("username").notEmpty().withMessage("username is required"),
  body("fullName").notEmpty().withMessage("Full Name is required"),
];

const SinginValidator = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("email").isEmpty().whitelist("Please Provide Password"),
];

export { SignUpValidator, SinginValidator };
