import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleEntityLike = async ({ Model, field, id, userId, label }) => {
    if (!isValidObjectId(id)) {
        throw new ApiError(400, `Invalid ${field}Id`);
    }

    const exists = await Model.exists({ _id: id });
    if (!exists) {
        throw new ApiError(404, `${label} not found`);
    }

    const existingLike = await Like.findOne({
        [field]: id,
        likedBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return { isLiked: false };
    }

    await Like.create({
        [field]: id,
        likedBy: userId,
    });

    return { isLiked: true };
};

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const result = await toggleEntityLike({
        Model: Video,
        field: "video",
        id: videoId,
        userId: req.user?._id,
        label: "Video",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Video like status toggled successfully")
        );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const result = await toggleEntityLike({
        Model: Comment,
        field: "comment",
        id: commentId,
        userId: req.user?._id,
        label: "Comment",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Comment like status toggled successfully"
            )
        );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const result = await toggleEntityLike({
        Model: Tweet,
        field: "tweet",
        id: tweetId,
        userId: req.user?._id,
        label: "Tweet",
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Tweet like status toggled successfully")
        );
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideosAggregate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
                video: { $exists: true, $ne: null },
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
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
                        $unwind: "$ownerDetails",
                    },
                ],
            },
        },
        {
            $unwind: "$likedVideo",
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                _id: 0,
                likedVideo: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    owner: 1,
                    title: 1,
                    description: 1,
                    views: 1,
                    duration: 1,
                    createdAt: 1,
                    isPublished: 1,
                    ownerDetails: 1,
                },
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideosAggregate,
                "Liked videos fetched successfully"
            )
        );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
