import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    if (!channelId) {
        throw new ApiError(400, "provide channel id");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "invalid channel id");
    }

    const subscriberId = req.user._id

    const exitingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    });

    if (exitingSubscription) {
        await exitingSubscription.deleteOne();
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed from channel successfully")
        )
    }

    const newSubscription = await Subscription.create({
        channel: channelId,
        subscriber: subscriberId
    })

    res.status(201).json(
        new ApiResponse(200, newSubscription, "subscription status toggled successfully")
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Provide channel ID");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
            },
        },
        {
            $unwind: "$subscriberDetails",
        },
        {
            $project: {
                _id: 0,
                subscriberId: "$subscriberDetails._id",
                name: "$subscriberDetails.name",
                email: "$subscriberDetails.email",
            },
        },
    ]);

    console.log(subscribers);

    res.status(200).json(
        new ApiResponse(200, "Fetched channel subscribers", subscribers)
    );
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!subscriberId) {
        throw new ApiError(400, "subscription id reqiure");
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "invalid user");
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails",
            },
        },
        {
            $unwind: "$channelDetails",
        },
        {
            $project: {
                _id: 0,
                channelId: "$channelDetails._id",
                name: "$channelDetails.name", // update fields as needed
                email: "$channelDetails.email",
            },
        },
    ])
    console.log(channels);

    const result = await Subscription.find()
        .populate("channel", "name email")  // populate channel details
        .where("subscriber")
        .equals("6846a03d3527314260fab67f");

    console.log(result);

    res.status(200).json(
        new ApiResponse(200, "fatched subscribed channels successfully", channels)
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}