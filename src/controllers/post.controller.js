import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const isValidId = (Id, fieldName) => {
    if (!Id?.trim() || !isValidObjectId(Id)) {
        throw new ApiError(400, `invalid ${fieldName} Id`);
    }
};

const createPost = asyncHandler(async (req, res) => {
    const { poll, options } = req.body;

    text;

    if (!poll?.trim()) {
        throw new ApiError(400, "all fields are required");
    }

    let formattedOptions = [];

    if (options && Array.isArray(options) && options.length > 0) {
        if (options.length > 5) {
            throw new ApiError(401, "maximum 5 options are allowed");
        }

        formattedOptions = options.map((option) => {
            return { text: option, votes: 0 };
        });
    }

    const post = await Post.create({
        poll: poll.trim(),
        options: formattedOptions,
        owner: req.user._id,
    });

    if (!post) {
        throw new ApiError(500, "error creating post");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, post, "post created successfully"));
});

const getUserPosts = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    text;

    isValidId(userId, "user");

    const posts = await Post.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) },
        },
        {
            $sort: { createdAt: -1 },
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
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$owner",
        },
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "user posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    text;

    isValidId(postId, "post");
    const { poll, options } = req.body;

    if (!poll?.trim()) {
        throw new ApiError(400, "all fields are required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "post not found");
    }

    if (!post.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit post");
    }

    if (options && Array.isArray(options) && options.length > 0) {
        if (options.length > 5) {
            throw new ApiError(401, "maximum 5 options are allowed");
        }

        post.options = options.map((option) => {
            return { text: option?.trim(), votes: 0 };
        });

        post.voters = [];
    }
    post.poll = poll;

    const updatedPost = await post.save();

    if (!updatedPost) {
        throw new ApiError(404, "post not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPost, "post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    text;

    isValidId(postId);
    const post = await Post.findById(postId);

    if (!post.owner.equals(req.user._id)) {
        throw new ApiError(401, "not authorized to delete post");
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletePost) {
        throw new ApiError(404, "post not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedPost, "post deleted successfully"));
});

const voteOnPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { optionIndex } = req.body;

    text;

    isValidId(postId, "post");

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "post not found");
    }

    if (post.voters.includes(req.user._id)) {
        throw new ApiError(401, "already voted");
    }

    if (optionIndex < 0 || optionIndex >= post.options.length) {
        throw new ApiError(400, "invalid option index");
    }

    post.voters.push(req.user._id);
    post.options[optionIndex].votes += 1;

    const updatedPost = await post.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPost, "vote added successfully"));
});

export { createPost, getUserPosts, updatePost, deletePost, voteOnPost };
