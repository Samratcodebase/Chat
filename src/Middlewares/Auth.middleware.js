import ApiError from "../Utils/ApiError.js";
import { VerifyToken } from "../Utils/TokenValidator.js";
import User from "../Models/User.model.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.AccesToken;
    const refreshToken = req.cookies?.RefreshToken;

    if (!accessToken) {
      if (!refreshToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized Access"));
      }

      const decodedRefresh = VerifyToken(refreshToken);
 
      if (!decodedRefresh.valid) {
        return res.status(401).json(new ApiError(401, "Invalid Refresh Token"));
      }

      const user = await User.findById(decodedRefresh.decoded.id);
      console.log("AuthMiddleware user from refresh:", user);
      if (!user) {
        return res.status(401).json(new ApiError(401, "Unauthorized Access"));
      }

      const newRefreshToken = user.GenerateRefreshToken();
      const newAccessToken = user.GenerateAccessToken();

      res.cookie("RefreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("AccesToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      req.user = user;

      return next();
    }

    const decodedAccess = await VerifyToken(accessToken);

    if (!decodedAccess.valid) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }

    const user = await User.findById(decodedAccess.decoded.id);

    if (!user) {
      return res.status(401).json(new ApiError(401, "Unauthorized Access"));
    }

    req.user = user;
    console.log("AuthMiddleare User Check", user);

    next();
  } catch (error) {
    console.error("AuthMiddleware error:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export default AuthMiddleware;
