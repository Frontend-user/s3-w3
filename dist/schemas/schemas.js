"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSchema = exports.userSchema = exports.recoveryCodeSchema = exports.blogSchema = exports.postSchema = exports.tokenSchema = exports.commentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
exports.commentSchema = new mongoose_1.default.Schema({
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    likesInfo: {
        likesCount: { type: Number, required: true },
        dislikesCount: { type: Number, required: true },
        myStatus: { type: String, required: true },
        usersLikeStatuses: { type: (Array), required: false }
    },
    createdAt: { type: String, required: true },
    postId: { type: String, required: true }
});
exports.tokenSchema = new mongoose_1.default.Schema({
    refreshToken: { type: String, required: true }
});
exports.postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    blogId: { type: String || mongodb_1.ObjectId, required: true }
});
exports.blogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
});
exports.recoveryCodeSchema = new mongoose_1.default.Schema({
    userId: { type: mongodb_1.ObjectId, required: true },
    recoveryCode: { type: String, required: true },
    email: { type: String, required: true },
});
exports.userSchema = new mongoose_1.default.Schema({
    accountData: {
        login: { type: String, required: true },
        email: { type: String, required: true },
        createdAt: { type: String, required: true },
    },
    passwordSalt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: String, required: true } || { type: Date, required: true }
    },
    isConfirmed: { type: Boolean, required: true },
    isCreatedFromAdmin: { type: Boolean, required: true }
});
exports.deviceSchema = new mongoose_1.default.Schema({
    userId: { type: mongodb_1.ObjectId, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: String, required: true },
    deviceId: { type: String, required: true },
});
//# sourceMappingURL=schemas.js.map