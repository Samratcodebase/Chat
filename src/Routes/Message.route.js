import express from "express";
import {
  AllContacts,
  Chats,
  MessagesByUserID,
  sendMessage,
} from "../Controllers/Message.controller.js";
import AuthMiddleware from "../Middlewares/Auth.middleware.js";
import { upload } from "../Lib/Multer.js";
const router = express.Router();

router.get("/contacts", AuthMiddleware, AllContacts);
router.get("/chats", AuthMiddleware, Chats);
router.get("/:id", AuthMiddleware, MessagesByUserID);
router.post("/send/:id", AuthMiddleware, upload.single("image"), sendMessage);

export default router;
