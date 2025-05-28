import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"; // Assuming you have a User model defined
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // Simulate user registration logic
    //get user data from request body
    //validate user data - not empty, valid email, etc.
    //check user already exists
    //check for image, check for avatar
    //upload image to cloudinary, avater
    //create user object - create entity in database
    //remove password and refresh token field from response
    //check for user creation 
    //return response

    const {fullName, email, username, password} = req.body
    console.log("email", email);


    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingUser = User.findOne({ 
    $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "Username or email already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)    

    if (!avatar){
        throw new ApiError(500, "Failed to upload avatar image.");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refresh")

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user.");
    }

    return res.status(201).json(
        new ApiResponse(200, "User registered successfully.", createdUser)
    );
})

export { registerUser };


