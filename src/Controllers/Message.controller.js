import User from "../Models/User.model.js";
import Message from "../Models/Message.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ApiError from "../Utils/ApiError.js";

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

const Chats = () => {};
const MessagesByUserID = async (req, res) => {
  try {
    const myid = req.user._id;
    const { id: userTochatID } = req.params;
    const message = await Message.find({
      $or: [
        { senderID: myid, receiverId: userTochatID },
        { senderID: userTochatID, receiverId: myid },
      ],
    });

    req.status(200).json(new ApiResponse(200, "Messages Fetched", message));
  } catch (error) {
    console.log("Eoror in getMessage Controller:", error.message);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
    next(error);
  }
};
const sendMessage = async (req, res) => {
   try {
    const {text , image}=req.body;
    const {id:receiverID}=req.params;
    const senderID=req.user._id;

    

   } catch (error) {
    
   } 
};

export { AllContacts, Chats, MessagesByUserID, sendMessage };
