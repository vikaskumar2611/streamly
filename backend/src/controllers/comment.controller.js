import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const isValidId = (Id, fieldName) => {
    if (!Id?.trim() || !isValidObjectId(Id)) {
        throw new ApiError(400, `invalid ${fieldName} Id`);
    }
};

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    isValidId(videoId, "video");

    const video = await Video.findById(videoId);

    if (!video || !video.isPublished) {
        throw new ApiError(404, "video not found");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
                parentComment: null,
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $skip: (pageInt - 1) * limitInt,
        },
        {
            $limit: limitInt,
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "parentComment",
                as: "replies",
                pipeline: [
                    { $sort: { createdAt: 1 } },
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
                        $unwind: "$owner",
                    },
                    {
                        $project: {
                            content: 1,
                            owner: 1,
                        },
                    },
                ],
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
                repliesCount: { $size: "$replies" },
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $project: {
                content: 1,
                owner: 1,
                replies: 1,
                repliesCount: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    const totalComments = await Comment.countDocuments({
        video: new mongoose.Types.ObjectId(videoId),
        parentComment: null,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                pagination: {
                    totalComments,
                    currentPage: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(totalComments / limitInt),
                    hasNextPage: pageInt * limitInt < totalComments,
                    hasPrevPage: pageInt > 1,
                },
            },
            "comments fetched successfully",
        ),
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { content, parentCommentId } = req.body;
    const { videoId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "comment cannot be empty");
    }

    isValidId(videoId, "video");

    const video = await Video.findById(videoId);

    if (!video || !video.isPublished) {
        throw new ApiError(404, "video not found");
    }

    if (parentCommentId?.trim()) {
        if (!isValidObjectId(parentCommentId)) {
            throw new ApiError(400, "invalid parent comment id");
        } else {
            const parent = await Comment.findById(parentCommentId);
            if (parent?.video.toString() !== videoId) {
                throw new ApiError(
                    400,
                    "parent comment not found/not assoiciated with this video",
                );
            }
        }
    }

    const userId = req.user._id;

    const initialCommentCount = await Comment.countDocuments({
        video: videoId,
        owner: userId,
    });

    if (initialCommentCount >= 5) {
        throw new ApiError(429, "more than limited comments done already");
    }

    const newComment = await Comment.create({
        video: videoId,
        owner: userId,
        content: content.trim(),
        parentComment: parentCommentId?.trim() || null,
    });

    if (!newComment) {
        throw new ApiError(500, "error in registering comment");
    }

    await newComment.populate({
        path: "owner",
        select: "fullName avatar username",
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, newComment, "comment registered successfully"),
        );
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "comment cannot be empty");
    }

    isValidId(commentId, "comment");

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (req.user._id.toString() !== comment.owner.toString()) {
        throw new ApiError(403, "you dont have access to update this comment");
    }

    comment.content = content.trim();
    await comment.save();

    await comment.populate({
        path: "owner",
        select: "fullName avatar username",
    });

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "comment edited successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    isValidId(commentId, "comment");

    const comment = await Comment.findById(commentId);

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (req.user._id.toString() !== comment.owner.toString()) {
        throw new ApiError(403, "you dont have access to delete this comment");
    }

    const deleteStatus = await Comment.deleteMany({
        $or: [{ _id: commentId }, { parentComment: commentId }],
    });

    if (deleteStatus?.acknowledged !== true) {
        throw new ApiError(500, "error is deleting comments");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deleteStatus.deletedCount,
                "comments deleted successfully",
            ),
        );
});

export { getVideoComments, addComment, updateComment, deleteComment };
