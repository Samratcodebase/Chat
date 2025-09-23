import "dotenv/config";
import User from "../Models/User.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import {
  sendWelcomeEmail,
  sendVerificationEmail,
} from "../services/Email/EmailHandler.js";
import imagekit from "../Lib/ImageKit.js";

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let AccesToken = req.cookies.AccesToken;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(409)
        .json(new ApiError(409, "Invalid Email or Password"));
    }

    if (AccesToken) {
      return res.status(200).json(new ApiResponse(200, "Already Logined in"));
    }
    AccesToken = await user.GenerateAccessToken();
    res.cookie("AccesToken", AccesToken);
    const isMatched = await user.ComparePassword(password); //retuns ture or false
    if (isMatched) {
      return res.status(200).json(new ApiResponse(200, " Login SuccessFull"));
    } else {
      return res
        .status(409)
        .json(new ApiError(409, "Invalid Email or Password"));
    }
  } catch (error) {
    console.log("Error in Login Controller", error);
  }
};

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

  if (new Date() > new Date(user.verificationTokenExpires)) {
    return res
      .status(410)
      .json(new ApiError(410, "Verification token has expired"));
  }

  user.isVerified = true;
  user.VerificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "User verification successful"));
};

const Logout = async (req, res) => {
  const UserID = req.user._id;

  const user = await User.findOne({ _id: UserID });
  if (!user) {
    return res.status(401).status(new ApiError(401, "Unauthorized Access"));
  }

  user.isAtiveNow = false;
  await user.save();

  res.cookie("AccesToken", "");
  res.cookie("RefreshToken", "");

  return res.status(200).json(new ApiResponse(200, "Logout SuccessFull"));
};
const updateProfile = async (req, res) => {
  try {
   
    console.log("updateProfile req.user:", req.user);
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

   
    const file = req.file;
    if (!file) {
      return res.status(400).json(new ApiError(400, "No file uploaded"));
    }

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/profiles",
    });
    if (!result || !result.url) {
      return res.status(500).json(new ApiError(500, "Image upload failed"));
    }

    user.avatarUrl = result.url;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "File Upload Successful", result));
  } catch (error) {
    console.log("Error in updateProfile", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error Please Try Again Later"));
  }
};
export { Login, SignUp, VerifyUser, Logout, updateProfile };
