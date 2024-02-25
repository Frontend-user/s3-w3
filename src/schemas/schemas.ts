import mongoose from "mongoose";
import {PostEntityType} from "../common/types/post-type";
import {ObjectId} from "mongodb";
import {BlogEntityType} from "../common/types/blog-type";
import {UserEmailEntityType} from "../users/types/user-types";
import {RecoveryCodeType} from "../common/types/recovery-type";

export type usersIdsLikeStatuses = { userId: String, likeStatus: String }
export const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    likesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
        myStatus: {type: String, required: true},
        usersLikeStatuses: {type: Array<usersIdsLikeStatuses>, required: false}
    },
    createdAt: {type: String, required: true},
    postId: {type: String, required: true}
})
export const tokenSchema = new mongoose.Schema({
    refreshToken: {type: String, required: true}
})

export const postSchema = new mongoose.Schema<PostEntityType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    blogId: {type: String || ObjectId, required: true}
})
export const blogSchema = new mongoose.Schema<BlogEntityType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
});
export const recoveryCodeSchema = new mongoose.Schema<RecoveryCodeType>({
    userId: {type: ObjectId, required: true},
    recoveryCode: {type: String, required: true},
    email: {type: String, required: true},
})
export const userSchema = new mongoose.Schema<UserEmailEntityType>({
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true},
    },
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: String, required: true} || {type: Date, required: true}
    },
    isConfirmed: {type: Boolean, required: true},
    isCreatedFromAdmin: {type: Boolean, required: true}
});

export const deviceSchema = new mongoose.Schema({
    userId: {type: ObjectId, required: true},
    ip: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true},
    deviceId: {type: String, required: true},
});