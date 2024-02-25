"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsRepository = void 0;
const db_1 = require("../../db");
const current_user_1 = require("../../application/current-user");
const http_statuses_1 = require("../../common/constants/http-statuses");
class CommentsRepository {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield db_1.CommentModel.create(comment);
            return response ? response._id : false;
        });
    }
    updateComment(id, updateComment) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.CommentModel.updateOne({ _id: id }, updateComment);
            return response.matchedCount === 1;
        });
    }
    updateCommentLikeStatus(id, likeStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            //Получили лайк
            // если там нету обекта тогда пушим лайк и меняем статус | ГОТОВО
            //если есть и равен лайк тогда ничего
            //если есть и не равен лайк тогда меняем на лайк и статус на лайк
            const userIdLikeStatus = {
                userId: current_user_1.currentUser.userId,
                likeStatus: likeStatus
            };
            const comment = yield db_1.CommentModel.findOne({ _id: id });
            let commentLikeStatusesArray = comment.likesInfo.usersLikeStatuses;
            let findObject = commentLikeStatusesArray.find(o => o.userId === current_user_1.currentUser.userId);
            if (!findObject && likeStatus !== http_statuses_1.LIKE_STATUSES.NONE) {
                if (likeStatus === http_statuses_1.LIKE_STATUSES.LIKE) {
                    let currentLikes = comment.likesInfo.likesCount;
                    currentLikes++;
                    comment.likesInfo.likesCount = currentLikes;
                }
                else {
                    let currentDislikes = comment.likesInfo.dislikesCount;
                    currentDislikes++;
                    comment.likesInfo.dislikesCount = currentDislikes;
                }
                comment.likesInfo.myStatus = likeStatus;
                comment.likesInfo.usersLikeStatuses.push(userIdLikeStatus);
                comment.markModified('likesInfo');
                yield comment.save();
            }
            if (likeStatus !== http_statuses_1.LIKE_STATUSES.NONE && findObject && findObject.likeStatus !== likeStatus) {
                const getComment = yield db_1.CommentModel.findOne({ _id: id });
                let dislikes = getComment.likesInfo.dislikesCount;
                let likes = getComment.likesInfo.likesCount;
                if (likeStatus === http_statuses_1.LIKE_STATUSES.DISLIKE) {
                    dislikes++;
                    likes--;
                }
                else {
                    likes++;
                    dislikes--;
                }
                yield db_1.CommentModel.updateOne({ _id: id, 'likesInfo.usersLikeStatuses.userId': current_user_1.currentUser.userId }, {
                    '$set': {
                        'likesInfo.myStatus': likeStatus,
                        'likesInfo.likesCount': likes,
                        'likesInfo.dislikesCount': dislikes,
                        'likesInfo.usersLikeStatuses.$.likeStatus': likeStatus
                    }
                });
                const updatedComment = yield db_1.CommentModel.findOne({ _id: id });
                console.log(updatedComment.likesInfo.usersLikeStatuses, 'gggggggggggggggggggggggggggg');
            }
            if (likeStatus === http_statuses_1.LIKE_STATUSES.NONE && findObject && likeStatus !== comment.likesInfo.myStatus) {
                console.log(comment.likesInfo, 'BEFORE LIKEINO');
                const getComment = yield db_1.CommentModel.findOne({ _id: id });
                let dislikes = getComment.likesInfo.dislikesCount;
                let likes = getComment.likesInfo.likesCount;
                let pastLikeStatus = getComment.likesInfo.myStatus;
                if (pastLikeStatus === http_statuses_1.LIKE_STATUSES.DISLIKE) {
                    dislikes--;
                }
                else {
                    likes--;
                }
                yield db_1.CommentModel.updateOne({ _id: id }, {
                    '$set': {
                        'likesInfo.myStatus': http_statuses_1.LIKE_STATUSES.NONE,
                        'likesInfo.likesCount': likes,
                        'likesInfo.dislikesCount': dislikes,
                    },
                    $pull: { 'likesInfo.usersLikeStatuses': { userId: current_user_1.currentUser.userId } }
                });
                const updatedComment = yield db_1.CommentModel.findOne({ _id: id });
                console.log(updatedComment.likesInfo, 'gggggggggggggggggggggggggggglikesInfo');
                console.log(updatedComment.likesInfo.usersLikeStatuses, 'gggggggggggggggggggggggggggg');
            }
            return true;
        });
    }
    // let likes = 0
    // let dislikes = 0
    // commentLikeStatusesArray.forEach(item => {
    //     if (item.likeStatus === LIKE_STATUSES.LIKE) {
    //         likes += 1
    //     }
    // })
    // commentLikeStatusesArray.forEach(item => {
    //     if (item.likeStatus === LIKE_STATUSES.DISLIKE) {
    //         dislikes += 1
    //     }
    // })
    // comment.likesInfo.likesCount = likes
    // comment.likesInfo.dislikesCount = dislikes
    // comment.markModified('likesInfo.likesCount')
    // comment.markModified('likesInfo.dislikesCount')
    // let response = await comment.save()
    // return response.matchedCount === 1;
    // if (findObject && findObject.likeStatus === likeStatus) {
    //     console.log('likeStatus',likeStatus)
    //     return false
    // }
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.CommentModel.deleteOne({ _id: commentId });
            return !!comment;
        });
    }
}
exports.CommentsRepository = CommentsRepository;
//# sourceMappingURL=comments-repository.js.map