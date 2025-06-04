import mongoose from "mongoose";

// Message Schema Creation
const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // Fixed spelling
    text: { type: String },
    image: { type: String },
    file: {
        name: { type: String },
        type: { type: String },
        url: { type: String }, // Store file download URL from Cloudinary or any other service
    },
    seen: { type: Boolean, default: false }
}, { timestamps: true });

// Use model name "Message"
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
