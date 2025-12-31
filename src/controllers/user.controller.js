import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
  //console.log(req.body);
  const { username, email, fullName, password } = req.body;
  //console.log("email:", email);

  //validate
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //with $or you can search multiple things at once
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "user with email/username already exists");
  }
  console.log(req.files);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : "";

  if (!avatar) {
    throw new ApiError(400, "Avatar image is required");
  }

  //create a user
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //find recently created user in database
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //if user not found return error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  } else {
    console.log("User created");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user created"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body->data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    user.id
  );

  //here in user it has refreshToken undifined(resfresh token was saved later) and it also has password so we cannot send that

  //now we have the choice to either call the fresh user from database or update current object

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //prepare cookie to be sent
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }),
      "User logged In Seccessfully"
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    //extract user id rom req which we updated in verifyjwt middleware and reset its refresh token
    req.user._id,
    {
      $set: {
        refreshToken: 1,
      },
    },
    {
      //do this so you get updated token as response
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  //clear access token too
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  try {
    //get refresh token from cookie or body
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken;

    //check if token is present
    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    //verify token and get data from it
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    /*
        // Value of decodedToken
            {
                "_id": "65b3a2f9c845b1234567890",  // The user's ID
                "iat": 1706123456,                // "Issued At" timestamp
                "exp": 1706987456                 // "Expiration" timestamp
            }
        */

    //find user
    const user = await User.findById(decodedToken?._id);

    //check if user exists
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    //verify if the token is still valid
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    //generate new tokens
    const { accessToken, newrefreshToken } = await generateAcessAndRefreshToken(
      user._id
    );

    //send response with new tokens in cookie and body too
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Error while refreshing the token"
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  //take both from user
  const { oldPassword, newPassword } = req.body;

  //find and check if password is valid
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  //change password and save update in db
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "password changes seccessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "current user fetched seccessfully"));
});

const updateAcountDetails = asyncHandler(async (req, res) => {
  //take from user
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields required");
  }

  //find and update and return the updated user without password
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "details updated successfully"));
});

//after updating the images we need to delete the local files too and delete old images from cloudinary

const updateUserAvatar = asyncHandler(async (req, res) => {
  //take from user
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  //upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar on cloudinary");
  }

  const oldimageurl = req.user.avatar;

  //find and update in db and return updated user without password
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  deleteOnCloudinary(oldimageurl);
  // TODO: Delete the old avatar from cloudinary

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar image updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  //same as avatar
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading cover Image on cloudinary");
  }

  const oldimageurl = req.user.coverImage;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  deleteOnCloudinary(oldimageurl);
  // TODO: Delete the old cover image from cloudinary

  return res
    .status(200)
    .json(new ApiResponse(200, user, "cover Image image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
      /*
      we get
      {
        _id: "64a1b2c3d4e5f67890123456",
        fullName: "John Doe",
        username: "john",
        email: "john@example.com",
        avatar: "https://.../john.jpg",
        coverImage: "https://.../cover.jpg",
        // ...other user fields
        }
      */
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id", //user's _id
        foreignField: "channel", // find docs where this user is the channel
        as: "subscribers",
      },
      /*
        {
        _id: "64a1b2c3d4e5f67890123456",
        fullName: "John Doe",
        username: "john",
        // ...other original fields
        subscribers: [
            { _id: "sub1", channel: "64a1b2c3...", subscriber: "507f1f77bcf86cd799439011" }, // current user subscribed
            { _id: "sub2", channel: "64a1b2c3...", subscriber: "987f6e55abc123def4567890" },
            { _id: "sub3", channel: "64a1b2c3...", subscriber: "123456789abcdef123456789" },
            // ...maybe hundreds more
            ]
        }
      */
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber", // find docs where John is the subscriber
        as: "subscribedTo",
      },
      /*
      we get
        {
        _id: "64a1b2c3d4e5f67890123456",
        fullName: "John Doe",
        username: "john",
        subscribers: [ ...3 subscription docs above... ],
        subscribedTo: [
            { _id: "sub10", channel: "999999999999999999999999", subscriber: "64a1b2c3..." },
            { _id: "sub11", channel: "888888888888888888888888", subscriber: "64a1b2c3..." },
            // ...45 more
            ]
        }
      */
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
      //"$subscribers.subscriber" creates an array of just the subscriber fields from every document in the subscribers array which looks like this
      /*
      [ 
        "507f1f77bcf86cd799439011",
        "987f6e55abc123def4567890", 
        "123456789abcdef123456789"
        ]
      */
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
      //send only flagged fields
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "channel info fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
      /*
      we get 
      {
        _id: "507f1f77bcf86cd799439011",
        fullName: "Alex",
        watchHistory: [
            "64a1b2c3d4e5f67890123456",
            "64b2c3d4e5f6789012345678",
            "64c3d4e5f678901234567890"
        ],
        // ...other fields
        }
      */
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory", // array of video ObjectIds
        foreignField: "_id",
        as: "watchHistory", // overwrite the field with full video docs

        /*
            we get
            {
                _id: "64a1b2c3d4e5f67890123456",
                title: "Learn MongoDB",
                owner: "9876543210abcdef12345678",   // ObjectId
                duration: 1200,
                thumbnail: "...",
                views: 50000
            }
        */

        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
            /*
            we get
            {
                _id: "64a1b2c3d4e5f67890123456",
                title: "Learn MongoDB",
            owner: [
                {
                 _id: "9876543210abcdef12345678",
                fullName: "Tech Guru",
                username: "techguru",
                avatar: "https://.../techguru.jpg"
                }
            ],
            duration: 1200,
            // ...
            }
            */
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },

            /*
            we get
            {
                _id: "64a1b2c3d4e5f67890123456",
                title: "Learn MongoDB",
                owner: {
                    fullName: "Tech Guru",
                    username: "techguru",
                    avatar: "https://.../techguru.jpg"
                },
                duration: 1200,
                thumbnail: "...",
                views: 50000,
                createdAt: "..."
                }
            */
          },
        ],
      },
    },
  ]);
  /*
  final response 
  {
  _id: "507f1f77bcf86cd799439011",
  watchHistory: [
    {
      _id: "64a1b2c3d4e5f67890123456",
      title: "Learn MongoDB",
      owner: { fullName: "Tech Guru", username: "techguru", avatar: "..." },
      duration: 1200,
      views: 50000,
      thumbnail: "...",
      // all other video fields
    },
    {
      _id: "64b2c3d4e5f6789012345678",
      title: "Node.js Auth",
      owner: { fullName: "CodeMaster", username: "codemaster", avatar: "..." },
      // ...
    },
    // ...and the 3rd video
  ]
  // all other original user fields are still there
}
  */

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetches successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changeCurrentPassword,
  updateUserCoverImage,
  updateAcountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
  getCurrentUser,
};
