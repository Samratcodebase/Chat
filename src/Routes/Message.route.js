import express from "express";
import {
  AllContacts,
  Chats,
  MessagesByUserID,
  sendMessage,
} from "../Controllers/Message.controller.js";
import AuthMiddleware from "../Middlewares/Auth.middleware.js";
const router = express.Router();

router.get("/contacts", AuthMiddleware, AllContacts);
router.get("/chats", AuthMiddleware, Chats);
router.get("/:id", AuthMiddleware, MessagesByUserID);
router.post("/send/:id", AuthMiddleware, sendMessage);

export default router;
