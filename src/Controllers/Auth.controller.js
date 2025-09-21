import User from "../Models/User.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";

const Login = (req, res) => {
  
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

    return res
      .status(200)
      .json(new ApiResponse(true, "User Creation Successful", 200));
  } catch (err) {
    next(err); // Send any unhandled errors to your error handler
  }
};

export { Login, SignUp };
