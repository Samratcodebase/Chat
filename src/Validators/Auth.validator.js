import { check, body, param } from "express-validator";

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
  body("password").notEmpty().withMessage("Please Provide Password"),
];

const VerificationTokenValidator = [
  param("token")
    .notEmpty()
    .withMessage("Unauthorized access: token is missing"),
];

const UpdateProfileValidator = [
  check("File").custom((value, { req }) => {
    const file = req.file;
    if (!file) {
      throw new Error("Please Provide Profile Picture");
    }
    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Only JPEG and PNG files are allowed");
    }
    return true;
  }),
];

export { SignUpValidator, SinginValidator, VerificationTokenValidator ,UpdateProfileValidator};
