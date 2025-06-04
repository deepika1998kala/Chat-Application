import mongoose, { trusted } from "mongoose";

//User Schema Creation
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    fullName: {type: String, required: trusted},
    password: {type: String, required: true, minlength: 6},
    profilePic: {type: String, default:""},
    bio: {type: String},

}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
