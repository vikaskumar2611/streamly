import mongoose, { isValidObjectId, Types } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleFunction = (paramName, fieldname, modelName) =>
    asyncHandler(async (req, res) => {
        const Id = req.params[paramName];
        //TODO: toggle like on video
        if (!Id?.trim() || !isValidObjectId(Id)) {
            throw new ApiError(400, `invalid ${fieldname} id`);
        }

        const object = await modelName.findById(Id);

        if (!object) {
            throw new ApiError(404, `${fieldname} not found`);
        }

        if (fieldname === "video" && !object.isPublished) {
            throw new ApiError(404, `${fieldname} not found`);
        }

        const isLiked = await Like.findOneAndDelete({
            [fieldname]: Id,
            likedBy: req.user._id,
        });

        if (!isLiked) {
            await Like.create({
                [fieldname]: Id,
                likedBy: req.user._id,
            });
        }

        const likeCount = await Like.countDocuments({ [fieldname]: Id });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { likeCount, isLiked: !isLiked },
                    isLiked ? `${fieldname} unliked` : `${fieldname} liked`,
                ),
            );
    });

const toggleVideoLike = toggleFunction("videoId", "video", Video);

const toggleCommentLike = toggleFunction("commentId", "comment", Comment);

const togglePostLike = toggleFunction("postId", "post", Post);

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = new Types.ObjectId(req.user._id);

    const videos = await Like.aggregate([
        {
            $match: {
                likedBy: userId,
                video: { $exists: true, $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $match: { isPublished: true },
                    },
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            views: 1,
                            owner: 1,
                        },
                    },
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
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $unwind: "$videos",
        },
        {
            $replaceRoot: {
                newRoot: "$videos",
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "liked videos fetched successfully"),
        );
});

export { toggleCommentLike, togglePostLike, toggleVideoLike, getLikedVideos };
