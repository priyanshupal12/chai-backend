import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { tweet } = req.body
    if (!isValidObjectId(req.user._id)) {
        throw new ApiError(400, "invalid userid for tweeting")
    }

    if (!tweet) {
        throw new ApiError(400, "Tweet content is required");
    }

    if (!tweet || typeof tweet !== "string" || tweet.trim() === "") {
        throw new ApiError(400, "Tweet content is required and must be a non-empty string");
    }

    const newTweet = await Tweet.create({
        content: tweet,
        owner: req.user._id // assuming user is attached to req (via auth middleware)
    });

    res.status(201).json(
        new ApiResponse(201, "Tweet created successfully", newTweet)
    );
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.user._id

    if (!userId) {
        throw new ApiError(400, "userid require");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "invalid user id for tweets")
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, tweets, "User tweets fetched successfully")
    );
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!(tweetId && content)) {
        throw new ApiError(400, "tweetid and tweet is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid userId");
    }

    const updatedTweet = { content: content.trim() }

    const updateTweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: updatedTweet
    }, { new: true })

    res.status(200).json(
        new ApiResponse(200, updateTweet, "tweet-updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "tweetid id  is required for the deletion of the tweet");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "invalid user user action");
    }

    const tweet = await Tweet.findById(tweetId)
    await tweet.deleteOne()

    res.status(200).json(
        new ApiResponse(200, "tweet deleted", tweet))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}