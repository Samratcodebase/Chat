import User from "../Models/User.model.js";
import Message from "../Models/Message.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ApiError from "../Utils/ApiError.js";
import imagekit from "../Lib/ImageKit.js";
import mongoose from "mongoose";
const AllContacts = async (req, res) => {
  try {
    const UserID = req.user._id;

    const AllUsers = await User.find({ _id: { $ne: UserID } });

    return res
      .status(200)
      .json(new ApiResponse(200, "All Contact Fecthed Sucessfull", AllUsers));
  } catch (error) {
    console.log("Error in AllContacts Controller", error);
    next(error);
  }
};

const Chats = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    //Find All the Msges Where The  either the sender or Reciver is logged in user
    const messages = await Message.find({
      $or: [{ senderID: loggedInUserId }, { receiverID: loggedInUserId }],
    });

    const chatuserIDs = [
      ...new Set(
        messages.map((message) => {
          return message.senderID.toString() === loggedInUserId
            ? message.receiverID.toString()
            : message.senderID.toString();
        })
      ),
    ];

    const ChatPartners = await User.find({ _id: { $in: chatuserIDs } }).select(
      "-passwrod"
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Messsage Fetch Successfull", ChatPartners));
  } catch (error) {
    res.status(401).json(new ApiError(401, "Error   Fetching Messages"));
    next(error.message);
  }
};

const MessagesByUserID = async (req, res, next) => {
  try {
    const myid = new mongoose.Types.ObjectId(req.user._id);
    const userToChatID = new mongoose.Types.ObjectId(req.params.id);

    const messages = await Message.find({
      $or: [
        { senderID: myid, receiverID: userToChatID },
        { senderID: userToChatID, receiverID: myid },
      ],
    }).sort({ createdAt: 1 });

    if (!messages) {
      console.log("NO message");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Messages fetched", messages));
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    next(new ApiError(500, "Internal Server Error")); // ✅ Proper error forwarding
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverID } = req.params;
    const senderID = req.user._id;
    const Image = req.file;

    const result = await imagekit.upload({
      file: Image.buffer,
      fileName: Image.originalname,
      folder: "/ChatImages",
    });
    if (!result || !result.url) {
      return res.status(500).json(new ApiError(500, "Image upload failed"));
    }

    const messages = await Message.create({
      senderID,
      receiverID,
      image: result.url,
      text,
    });
    //:ToDo  Send Message Real Time when use is oneline

    if (!messages) {
      return res.status(500).status(new ApiError(500, "Internal Serve Error "));
    }
    return res.status(201).json(new ApiResponse(201, "Message Sent", messages));
  } catch (error) {
    console.log("Error in SendMessage Controller: ", error.message);

    return res.status(500).status(new ApiError(500, "Internal Serve Error "));
  }
};

export { AllContacts, Chats, MessagesByUserID, sendMessage };
