import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatrar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({ _id: this._id,
        username: this.username,
        email: this.email,
        fullName: this.fullName,
     }, process.env.ACEESS_TOKEN_SECRET, { expiresIn: process.env.ACEESS_TOKEN_EXPIRY });
    return token;
};

userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({ _id: this._id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    return token;
}



export const User = mongoose.model("User", userSchema);