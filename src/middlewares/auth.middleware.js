import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //fetch token from local strorage or header(in apps) and remove prefix and this is a sync function so no need for await
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    //verify this token and check if its valid after verifying decodedToken will look like this
    /*
    {
        "_id": "65f2a...",        // The ID you put in during generation
        "email": "hitesh@...",    // Any other data you packed in
        "iat": 1710123456,        // "Issued At" timestamp (auto-generated)
        "exp": 1710127056         // "Expiration" timestamp (auto-generated)
    }
    */
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //select user through token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Acess Token");
    }

    //replace user with fresh user
    req.user = user;

    //pass execution flow
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
