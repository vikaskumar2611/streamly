import mongoose, { isValidObjectId, Types } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = Video.findById(videoId);

    if (!video || !video.isPublished) {
        throw new ApiError(404, "video not found");
    }

    const isLiked = await Like.findOneAndDelete({
        video: videoId,
        likedBy: req.user._id,
    });

    if (!isLiked) {
        const like = await Like.create({
            video: videoId,
            likedBy: req.user._id,
        });
    }

    const likeCount = Like.countDocuments({ video: videoId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likeCount,
                isLiked ? "video unliked" : "video liked",
            ),
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    if (!commentId?.trim() || !isValidObjectId(commentId)) {
        throw new ApiError(400, "invalid comment id");
    }

    const comment = Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    const isLiked = Like.findOneAndDelete({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (!isLiked) {
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });
    }

    const likeCount = Like.countDocuments({ comment: commentId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likeCount,
                isLiked ? "comment unliked" : "comment liked",
            ),
        );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    if (!tweetId?.trim() || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid tweet id");
    }

    const tweet = Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "tweet not found");
    }

    const isLiked = Like.findOneAndDelete({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (!isLiked) {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        });
    }

    const likeCount = Like.countDocuments({ tweet: tweetId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likeCount,
                isLiked ? "tweet unliked" : "tweet liked",
            ),
        );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = new Types.ObjectId(req.user._id);

    const videos = Like.aggregate([
        {
            $match: { likedBy: userId },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
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
            $addFields: {
                videoDetails: {
                    $first: "$videos",
                },
            },
        },
        {
            $project: {
                videoDetails: 1,
            },
        },
        {
            $replaceRoot: {
                newRoot: "$videoDetails",
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "liked videos fetched successfully"),
        );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
