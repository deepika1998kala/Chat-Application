import express from "express";
import { getMessages, getUsersForSidebar, markedMessageAsSeen, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/auth.js";

const messageRouter = express.Router()


messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markedMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);


export default messageRouter;