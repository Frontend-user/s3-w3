"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../../validation/auth-validation");
const comments_validation_1 = require("../validation/comments-validation");
const composition_root_1 = require("../../common/composition-root/composition-root");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.put('/:commentId', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentContentValidation, comments_validation_1.commentIdExistValidation, comments_validation_1.haveAccesForUpdate, comments_validation_1.commentInputValidationMiddleware, composition_root_1.commentsController.updateComment.bind(composition_root_1.commentsController));
exports.commentsRouter.put('/:commentId/like-status', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentLikeStatusValidation, comments_validation_1.commentIdExistValidation, comments_validation_1.commentInputValidationMiddleware, composition_root_1.commentsController.updateCommentLikeStatus.bind(composition_root_1.commentsController));
exports.commentsRouter.delete('/:commentId', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentIdExistValidation, comments_validation_1.haveAccesForUpdate, comments_validation_1.commentDeleteInputValidationMiddleware, composition_root_1.commentsController.deleteCommentById.bind(composition_root_1.commentsController));
exports.commentsRouter.get('/:id', composition_root_1.commentsController.getCommentById.bind(composition_root_1.commentsController));
//# sourceMappingURL=comments-router.js.map