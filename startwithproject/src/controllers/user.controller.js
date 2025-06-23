const ApiError = require('../utlis/apierror.js');
const User = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utlis/cloudnairy.js");

const registeruser = async (req, res) => {
    try {
        const { fullname, email, username, password } = req.body;

        // Basic field validation
        if (!fullname || !email || !username || !password) {
            throw new ApiError(400, "All fields are required");
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        // File path extraction
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

        let avatarCloudUrl = "";
        let coverImageCloudUrl = "";

        if (avatarLocalPath) {
            const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
            if (!uploadedAvatar) {
                throw new ApiError(400, "Avatar upload failed");
            }
            avatarCloudUrl = uploadedAvatar;
        }

        if (coverImageLocalPath) {
            const uploadedCover = await uploadOnCloudinary(coverImageLocalPath);
            if (!uploadedCover) {
                throw new ApiError(400, "Cover image upload failed");
            }
            coverImageCloudUrl = uploadedCover;
        }

        // Create user
        const newUser = await User.create({
            fullname,
            avatar: avatarCloudUrl,
            coverimage: coverImageCloudUrl,
            email,
            username,
            password // You should hash this!
        });

        if (!newUser) {
            throw new ApiError(500, "User creation failed");
        }

        // Send back user info (excluding password/token)
        const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
        return res.status(201).json({ user: createdUser });

    } catch (err) {
        console.error(err);
        const status = err.statusCode || 500;
        const message = err.message || "Internal server error";
        return res.status(status).json({ error: message });
    }
};

module.exports = registeruser;
