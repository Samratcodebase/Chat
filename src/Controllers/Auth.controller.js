import "dotenv/config";
import User from "../Models/User.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
} from "../Utils/Email/EmailHandler.js";

const Login = (req, res) => {};

const SignUp = async (req, res, next) => {
  try {
    const { email, password, username, fullName } = req.body;

    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      return res.status(409).json(new ApiError(409, "User Already Exists"));
    }

    const user = await User.create({
      email,
      password,
      username,
      fullName,
    });

    if (!user) {
      return next(new ApiError(500, "Internal Server Error. Try Again Later."));
    }

    const AccesToken = user.GenerateAccessToken();
    const RefreshToken = user.GenerateRefreshToken();

    res.cookie("AccesToken", AccesToken);
    res.cookie("RefreshToken", RefreshToken);
    try {
      //Using Free Resend Account So Use the Email singed up with Resend
      await sendWelcomeEmail(user.email, user.fullName, process.env.CLIENT_URI);
    } catch (error) {
      console.log("Error Seding Email", error);
    }

    try {
      const verificationToken = await user.GenerateEmailVerificationToken();
      await sendVerificationEmail(
        user.email,
        user.fullName,
        process.env.CLIENT_URI,
        verificationToken
      );
    } catch (error) {
      console.log("Error Seding Verfication Email", error);
    }
    return res
      .status(200)
      .json(new ApiResponse(true, "User Creation Successful", 200));
  } catch (err) {
    next(err);
  }
};

const VerifyUser = async (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(400).json(new ApiError(400, "Token is required"));
  }

  const user = await User.findOne({ VerificationToken: token });

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid or expired token"));
  }

  // Check if token has expired
  if (new Date() > new Date(user.verificationTokenExpires)) {
    return res.status(410).json(new ApiError(410, "Verification token has expired"));
  }

  user.isVerified = true;
  user.VerificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, "User verification successful"));
};

export { Login, SignUp, VerifyUser };
