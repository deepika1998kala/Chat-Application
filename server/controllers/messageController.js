import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from '../server.js';

// Get all users except logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);

    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to mark message as seen using message ID
export const markedMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send message to selected user
// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const receiverId = req.params.id;
//     const senderId = req.user._id;
//     let imageUrl;

//     if (image) {
//       const uploadResponse = await cloudinary.uploader.upload(image);
//       imageUrl = uploadResponse.secure_url;
//     }

//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       text,
//       image: imageUrl
//     });

//     // Emit the new message to the receiver's socket
//     const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }

//     res.json({ success: true, newMessage });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };

// Send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image, file } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    let fileObj;

    // Upload image to Cloudinary
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        resource_type: "image"
      });
      imageUrl = uploadResponse.secure_url; // Must be a proper URL
    }

    // If a file is present (any type)
    if (file) {
      // Upload to Cloudinary or another storage (optional)
      const uploadedFile = await cloudinary.uploader.upload(file.data, {
        resource_type: "auto", // handles any file type
      });

      fileObj = {
        name: file.name,
        type: file.type,
        url: uploadedFile.secure_url,
      };
    }

    // Save message in DB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      file: fileObj,
    });

    // Emit to receiver if online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
