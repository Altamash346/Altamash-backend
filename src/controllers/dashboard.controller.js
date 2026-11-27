import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    const totalSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: userId,
            },
        },
        {
            $group: {
                _id: null,
                subscribersCount: {
                    $sum: 1,
                },
            },
        },
    ]);

    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $project: {
                likesCount: {
                    $size: "$likes",
                },
                viewsCount: "$views",
                totalVideos: 1,
            },
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: "$likesCount",
                },
                totalViews: {
                    $sum: "$viewsCount",
                },
                totalVideos: {
                    $sum: 1,
                },
            },
        },
    ]);

    const channelStats = {
        totalSubscribers: totalSubscribers[0]?.subscribersCount || 0,
        totalLikes: videoStats[0]?.totalLikes || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalVideos: videoStats[0]?.totalVideos || 0,
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelStats,
                "Channel stats fetched successfully"
            )
        );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user?._id);

    const videos = await Video.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $addFields: {
                createdAt: {
                    $dateToParts: { date: "$createdAt" },
                },
                likesCount: {
                    $size: "$likes",
                },
            },
        },
        {
            $project: {
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                views: 1,
                duration: 1,
                createdAt: 1,
                isPublished: 1,
                likesCount: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Channel videos fetched successfully")
        );
});

export { getChannelStats, getChannelVideos };
