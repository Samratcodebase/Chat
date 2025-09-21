import "dotenv/config"
import express from "express";
import authRoutes from "./Routes/Auth.route.js";
import errorHandler from "./Middlewares/ErrorHandler.js";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);
export default app;
