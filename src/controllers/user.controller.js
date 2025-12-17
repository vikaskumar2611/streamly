import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(
    async (req, res) => {
        //get user details from frontend
        //validation - not empty
        //check if user already exists:username,email
        //check for images,check for avatar
        //upload them to coudinary, avatar
        //create user object - create entry in db
        //remove password and refresh token field from response
        //check for user creation
        //return res

        //take info
        console.log(req.body);
        const {username,email,fullName,password} = req.body;
        console.log("email:",email)

        //validate
        if([fullName, email, username, password].some((field)=> field?.trim() === "" )){
            throw new ApiError(400,"All fields are required");
        }

        //with $or you can search multiple things at once
        const existedUser = await User.findOne({
            $or: [{username}, {email}]
        })
        if(existedUser){
            throw new ApiError(409, "user with email/username already exists");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        if(!avatar){
            throw new ApiError(400,"Avatar image is required");
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),


        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering user");
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser,"user created")
        )
    }
)

export {registerUser};