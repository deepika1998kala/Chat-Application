import express from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from "socket.io";


// dotenv.config();

const app = express();
const server = http.createServer(app);


//Initializa socket.io server

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

})

///Store online users
export const userSocketMap = {};  //{userId: socketId}

//Socket.io connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);
    if(userId){
        userSocketMap[userId] = socket.id;
    } 

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", ()=>{
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
    })
    
})


app.use(express.json({ limit: "4mb" }));
app.use(cors());


app.use("/api/status", (req, res) => res.send("Server is live"));
//Route Setup
app.use("/api/auth", userRouter);
//
app.use("/api/messages", messageRouter)

//Connect to MongoDB
await connectDB();

// const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
}

//Export the server for vercel
export default server;
