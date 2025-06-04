import mongoose from "mongoose";

// Event listeners for mongoose connection (outside connectDB)
mongoose.connection.on('connected', () => console.log("Database Connected"));
mongoose.connection.on('error', (err) => console.log("Database connection error:", err));

export const connectDB = async () => {
    try {
        // Connect using the full MONGODB_URI including the database name
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("Failed to connect to DB:", error);
        process.exit(1); // Optional: exit if DB connection fails
    }
};
