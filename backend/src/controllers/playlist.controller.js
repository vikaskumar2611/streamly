import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isValidId = (Id, fieldName) => {
    if (!Id?.trim() || !isValidObjectId(Id)) {
        throw new ApiError(400, `invalid ${fieldName} Id`);
    }
};

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPublic } = req.body;

    if (!name.trim() || !description.trim()) {
        throw new ApiError(401, "all fields are required");
    }

    if (isPublic === undefined) {
        throw new ApiError(401, "visibility status is required");
    }

    const userId = req.user._id;

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId,
        isPublic,
    });

    if (!playlist) {
        throw new ApiError(500, "error in creating playlist");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "playlist made successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    isValidId(userId, "user");

    const currentUser = req.user._id;

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                $or: [
                    { isPublic: true },
                    { owner: new mongoose.Types.ObjectId(currentUser) },
                ],
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "playlists fetched successfully"),
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id

    isValidId(playlistId, "playlist");
    const currentUser = req.user._id;

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
                $or: [
                    { isPublic: true },
                    { owner: new mongoose.Types.ObjectId(currentUser) },
                ],
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
                    },
                ],
            },
        },
    ]);

    if (!playlist?.length) {
        throw new ApiError(404, "playlist not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist[0], "playlist fetched successfully"),
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    isValidId(playlistId, "playlist");
    isValidId(videoId, "video");

    const [playlist, video] = await Promise.all([
        Playlist.findById(playlistId),
        Video.findById(videoId),
    ]);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!video || !video.isPublished) {
        throw new ApiError(404, "video not found");
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { new: true },
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    isValidId(playlistId, "playlist");
    isValidId(videoId, "video");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true },
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "video removed from playlist",
            ),
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist

    isValidId(playlistId, "playlist");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit this playlist");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(500, "error deleting playlist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "plylist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(401, "all fields are required");
    }

    isValidId(playlistId, "playlist");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name: name,
            description: description,
        },
        { new: true },
    );

    if (!updatedPlaylist) {
        throw new ApiError(500, "error updating playlist name/description");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "playlist updated successfully",
            ),
        );
});

const togglePlaylistStatus = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    isValidId(playlistId, "playlist");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (!playlist.owner.equals(req.user._id)) {
        throw new ApiError(401, "you are not authorized to edit this playlist");
    }

    playlist.isPublic = !playlist.isPublic;
    const updatedPlaylist = await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "status togelled successfully",
            ),
        );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    togglePlaylistStatus,
};
