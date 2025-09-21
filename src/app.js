import "dotenv/config"
import express from "express";
import authRoutes from "./Routes/Auth.route.js";
import errorHandler from "./Middlewares/ErrorHandler.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth", authRoutes);

app.use(errorHandler);
export default app;
