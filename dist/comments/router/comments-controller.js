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
exports.CommentsController = void 0;
const mongodb_1 = require("mongodb");
const http_statuses_1 = require("../../common/constants/http-statuses");
class CommentsController {
    constructor(commentsService, commentQueryRepository) {
        this.commentsService = commentsService;
        this.commentQueryRepository = commentQueryRepository;
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.commentsService.updateComment(new mongodb_1.ObjectId(req.params.commentId), req.body.content);
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    updateCommentLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.commentsService.updateCommentLikeStatus(new mongodb_1.ObjectId(req.params.commentId), req.body.likeStatus);
                let comment = yield this.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(req.params.commentId), req.headers.authorization);
                // res.send(comment)
                console.log(comment, 'updateCommentLikeStatus');
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.commentsService.deleteComment(new mongodb_1.ObjectId(req.params.commentId));
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentQueryRepository.getCommentById(new mongodb_1.ObjectId(req.params.id), req.headers.authorization);
            console.log(comment, 'comment');
            return comment ? res.send(comment) : res.sendStatus(404);
        });
    }
}
exports.CommentsController = CommentsController;
//# sourceMappingURL=comments-controller.js.map