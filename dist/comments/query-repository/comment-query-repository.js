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
exports.CommentQueryRepository = void 0;
const db_1 = require("../../db");
const blogs_sorting_1 = require("../../blogs/blogs-query/utils/blogs-sorting");
const blogs_paginate_1 = require("../../blogs/blogs-query/utils/blogs-paginate");
const http_statuses_1 = require("../../common/constants/http-statuses");
const jwt_service_1 = require("../../application/jwt-service");
class CommentQueryRepository {
    getCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const { skip, limit, newPageNumber, newPageSize } = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            const comments = yield db_1.CommentModel.find({ postId: postId }).sort(sortQuery).skip(skip).limit(limit).lean();
            const allComments = yield db_1.CommentModel.find({ postId: postId }).sort(sortQuery).lean();
            let pagesCount = Math.ceil(allComments.length / newPageSize);
            const fixArrayIds = comments.map((item => this.changeCommentFormat(item)));
            return {
                "pagesCount": pagesCount,
                "page": newPageNumber,
                "pageSize": newPageSize,
                "totalCount": allComments.length,
                "items": fixArrayIds
            };
        });
    }
    getCommentById(commentId, auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield db_1.CommentModel.findOne({ _id: commentId }).lean();
            let accessUserId;
            if (auth) {
                accessUserId = yield jwt_service_1.jwtService.checkToken(auth.split(' ')[1]);
            }
            if (accessUserId) {
                let usersLikeStatuses = comment.likesInfo.usersLikeStatuses;
                if (usersLikeStatuses && usersLikeStatuses.length > 0) {
                    let info = usersLikeStatuses.find(o => o.userId === accessUserId);
                    if (info) {
                        comment.likesInfo.myStatus = info.likeStatus;
                    }
                    else {
                        comment.likesInfo.myStatus = http_statuses_1.LIKE_STATUSES.NONE;
                    }
                }
            }
            else {
                comment.likesInfo.myStatus = http_statuses_1.LIKE_STATUSES.NONE;
            }
            // else if(currentUser.userId && comment) {
            //     let usersLikeStatuses:any[] | undefined = comment!.likesInfo.usersLikeStatuses
            //     let info
            //     if(usersLikeStatuses && usersLikeStatuses.length > 0){
            //         info = usersLikeStatuses.find(o=>o.userId ===currentUser.userId)
            //         comment!.likesInfo.myStatus = info.likeStatus
            //     }
            //     comment!.likesInfo.myStatus = info.likeStatus
            //
            // }
            return comment ? this.changeCommentFormat(comment) : false;
        });
    }
    changeCommentFormat(obj) {
        obj.id = obj._id;
        delete obj._id;
        delete obj.likesInfo.usersLikeStatuses;
        delete obj.__v;
        delete obj.postId;
        return obj;
    }
}
exports.CommentQueryRepository = CommentQueryRepository;
//# sourceMappingURL=comment-query-repository.js.map