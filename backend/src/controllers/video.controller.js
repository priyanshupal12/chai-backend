import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import e from "express"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    if (sortType == 'asc') sortType = 1;
    else if (sortBy == 'desc') sortBy = -1
    else sortBy = -1

    if (!sortBy) sortBy = "createdAt";
    if (!query) throw new ApiError(400, "query is required")
    if (!userId)
        if (isValidObjectId(userId)) throw new ApiError(400, "invalid userId");

    const user = userId || req.user._id;

    const aggregate = Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(user)
            }
        },
        {
            $match: {
                title: {
                    $regex: query
                }
            }
        },
        {
            $sort: {
                [sortBy]: sortType
            }
        }
    ]);

    const myCustomLabels = {
        totalDocs: "videoCount",
        docs: "videos",
        page: "currentPage"
    };
    const options = { page, limit, customLabels: myCustomLabels };

    await Video.aggregatePaginate(aggregate, options)
        .than(function (data) {
            return res.status(200)
                .json(new ApiResponse(200, data, "got all video successfully"));
        })
        .catch(function (error) {
            console.log(error);

        })
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    const { videoFile, thumbnail } = req?.files

    if (!title || !description || !videoFile || !thumbnail) {
        throw new ApiError(400, "Title, description, video file and thumbnail are required")
    }

    let videoLocalpath;
    if (req.files && Array.isArray(req.files.videoFile) && req.files.videoFile.length > 0) {
        videoLocalpath = req.files.videoFile[0]?.path;
    }

    let thumbnailLocalpath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalpath = req.files.thumbnail[0]?.path;
    }

    if (!videoLocalpath || !thumbnailLocalpath) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const videoUpload = await uploadOnCloudinary(videoLocalpath)
    const thumbnailurlUpload = await uploadOnCloudinary(thumbnailLocalpath)

    if (!videoUpload || !thumbnailurlUpload) {
        throw new ApiError(500, "Failed to upload video or thumbnail to cloudinary");
    }

    const video = await Video.create(
        {
            videoFile: videoUpload.url,
            description,
            title,
            thumbnail: thumbnailurlUpload.url,
            duration: videoUpload?.duration, // Assuming video.duration is available
            owner: req.user._id // Assuming req.user is populated with the authenticated user
        }
    )

    if (!video) {
        throw new ApiError(500, "failed to create video");
    }

    res.status(201).json(
        new ApiResponse(201, "Video published successfully", video)
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(201).json(
        new ApiResponse(200, data, "Video retrieved successfully", video)
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const { title, description } = req.body;
    const thumbnail = req.files.thumbnail[0]?.path;

    if (title || description || thumbnail) {
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (thumbnail) {
            const thumbnailurlUpload = await uploadOnCloudinary(thumbnail);
            if (!thumbnailurlUpload) {
                throw new ApiError(500, "Failed to upload thumbnail to cloudinary");
            }
            updateData.thumbnail = thumbnailurlUpload.url;
        }
    } else {
        throw new ApiError(400, "At least one field (title, description, thumbnail) is required for update");
    }

    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            thumbnail: updateData.thumbnail
        }
    }, {new: true})

    if (!video) {
        throw new ApiError(400, "video not found or failed to update");
    }

    res.status(200).json(
        new ApiResponse(201, "Video updated successfully", video)
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId)
    if (!video) {
        throw new ApiError(404, "video not found or failed to delete");
    }

    res.status(200).json(
        new ApiResponse(200, "Video deleted successfully", video)
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    const isPublished = video.isPublished;

    res.status(200).json(
        new ApiResponse(200, { isPublished: isPublished }, "Video publish status toggled successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}