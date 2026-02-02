import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "asc",
        userId,
    } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const matchStage = {};

    if (query) {
        const Sanitizedquery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchStage.title = { $regex: Sanitizedquery, $options: "i" };
    }

    if (userId?.trim() && isValidObjectId(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    if (userId?.trim() && userId !== req.user._id.toString()) {
        matchStage.isPublished = true;
    }

    const pageInt = parseInt(page) || 1;
    const limitInt = Math.min(parseInt(limit) || 10, 100);
    const safeSortBy = ["title", "createdAt", "views", "duration"].includes(
        sortBy,
    )
        ? sortBy
        : "createdAt";

    const videos = await Video.aggregate([
        {
            $match: matchStage,
        },
        {
            $sort: { [safeSortBy]: sortType === "asc" ? 1 : -1 },
        },
        {
            $skip: (pageInt - 1) * limitInt,
        },
        {
            $limit: limitInt,
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
        {
            $project: {
                videoFile: 1,
                duration: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                views: 1,
                owner: 1,
                createdAt: 1,
            },
        },
    ]);

    const totalVideos = await Video.countDocuments(matchStage);

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            pagination: {
                currentPage: pageInt,
                limit: limitInt,
                totalVideos,
                totalPages: Math.ceil(totalVideos / limitInt),
                hasNextPage: pageInt * limitInt < totalVideos,
                hasPrevPage: pageInt > 1,
            },
        }),
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields required");
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "video is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail is required");
    }

    const [videoFile, thumbnail] = await Promise.all([
        uploadOnCloudinary(videoLocalPath),
        uploadOnCloudinary(thumbnailLocalPath),
    ]);

    if (!thumbnail) throw new ApiError(500, "Error uploading thumbnail");
    if (!videoFile) throw new ApiError(500, "Error uploading video");

    const duration = videoFile.duration;

    if (!req.user._id) {
        throw new ApiError(401, "Unauthorised user");
    }
    const userId = req.user._id;
    const video = await Video.create({
        videoFile: videoFile.url,
        description,
        thumbnail: thumbnail.url,
        title,
        duration,
        owner: userId,
    });

    const createdvideo = await Video.findById(video._id);

    if (!createdvideo) {
        throw new ApiError(500, "Error in uploading video");
    } else {
        console.log("Video uploaded");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, createdvideo, "video uploaded successfully"),
        );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const isUnauthorised = req.user._id.toString() !== video.owner.toString();
    if (!video.isPublished && isUnauthorised) {
        throw new ApiError(404, "Video not found");
    }

    const videoResult = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) },
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

    if (!videoResult?.length) {
        throw new ApiError(404, "owner/video not found");
    }

    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 },
    });

    await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { watchHistory: videoId },
    });

    return res.status(200).json(new ApiResponse(200, videoResult[0]));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    const { title, description } = req.body;

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields required");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail not found");

    const thumbnail = thumbnailLocalPath
        ? await uploadOnCloudinary(thumbnailLocalPath)
        : "";

    if (!thumbnail) throw new ApiError(500, "Error uploading thumbnail");

    const videoUpdated = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                thumbnail: thumbnail.url,
                title,
                description,
            },
        },
        { new: true },
    );

    await deleteOnCloudinary(video.thumbnail);

    if (!videoUpdated) {
        throw new ApiError(500, "Error updating video information");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videoUpdated, "video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(400, "invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    const [videoDeleteResult, thumbnailDeleteResult] = await Promise.all([
        deleteOnCloudinary(video.videoFile),
        deleteOnCloudinary(video.thumbnail),
    ]);

    if (videoDeleteResult?.result !== "ok") {
        console.warn(`Error deleting video file -${video.videoFile}`);
    }

    if (thumbnailDeleteResult?.result !== "ok") {
        console.warn(`Error deleting thumbnail file -${video.thumbnail}`);
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) throw new ApiError(500, "Error deleting video");

    return res.status(200).json(new ApiResponse(200, deletedVideo));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(404, "invalid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(404, "invalid video ID");

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    video.isPublished = !video.isPublished;
    const updatedVideo = await video.save();

    return res.status(200).json(new ApiResponse(200, updatedVideo));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
