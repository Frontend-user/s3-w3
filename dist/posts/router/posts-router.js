"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = exports.postValidators = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../../validation/auth-validation");
const posts_validation_1 = require("../../validation/posts-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const comments_validation_1 = require("../../comments/validation/comments-validation");
const posts_controller_1 = require("./posts-controller");
const composition_root_1 = require("../../common/composition-root/composition-root");
exports.postValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    posts_validation_1.postBlogIdValidation,
    posts_validation_1.postBlogIdExistValidation,
    blogs_validation_1.inputValidationMiddleware
];
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.post('/:postId/comments', auth_validation_1.bearerAuthMiddleware, comments_validation_1.commentPostIdExistValidation, comments_validation_1.commentContentValidation, comments_validation_1.commentInputValidationMiddleware, composition_root_1.postsController.createCommentByPostId.bind(posts_controller_1.PostsController));
exports.postsRouter.get('/:postId/comments', comments_validation_1.commentPostIdExistValidation, comments_validation_1.commentInputValidationMiddleware, composition_root_1.postsController.createCommentByPostId.bind(posts_controller_1.PostsController));
exports.postsRouter.get('/', composition_root_1.postsController.getPosts.bind(posts_controller_1.PostsController));
exports.postsRouter.get('/:id', posts_validation_1.postIdValidation, composition_root_1.postsController.getPostById.bind(posts_controller_1.PostsController));
exports.postsRouter.post('/', ...exports.postValidators, composition_root_1.postsController.createPost.bind(posts_controller_1.PostsController));
exports.postsRouter.put('/:id', ...exports.postValidators, composition_root_1.postsController.updatePost.bind(posts_controller_1.PostsController));
exports.postsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, posts_validation_1.postIdValidation, composition_root_1.postsController.deletePost.bind(posts_controller_1.PostsController));
//# sourceMappingURL=posts-router.js.map