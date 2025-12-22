import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //fetch token from local strorage or header(in apps) and remove prefix and this is a sync function so no need for await
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    //verify this token with the token in backend
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
