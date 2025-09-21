import { body } from "express-validator";

const SignUpValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  body("name").notEmpty().withMessage("Name is required"),
];




export{SignUpValidator}