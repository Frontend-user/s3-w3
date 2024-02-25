"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = exports.blogsPostBindValidators = void 0;
const composition_root_1 = require("../../common/composition-root/composition-root");
const blogs_validation_1 = require("../../validation/blogs-validation");
const auth_validation_1 = require("../../validation/auth-validation");
const express_1 = require("express");
const blogs_posts_bind_validation_1 = require("../../validation/blogs-posts-bind-validation");
const posts_validation_1 = require("../../validation/posts-validation");
exports.blogsPostBindValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    blogs_posts_bind_validation_1.postBlogBindIdExistValidation,
    blogs_posts_bind_validation_1.blogsPostsBindingInputValidationMiddleware
];
const blogValidators = [
    auth_validation_1.bearerAndAdminAuthMiddleware,
    blogs_validation_1.blogDescValidation,
    blogs_validation_1.blogNameValidation,
    blogs_validation_1.blogWebUrlValidation,
    blogs_validation_1.blogWebUrlValidation2,
    blogs_validation_1.inputValidationMiddleware,
];
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', composition_root_1.blogsController.getBlogs.bind(composition_root_1.blogsController));
exports.blogsRouter.get('/:id', blogs_validation_1.blogIdValidation, composition_root_1.blogsController.getBlogById.bind(composition_root_1.blogsController));
exports.blogsRouter.post('/', ...blogValidators, composition_root_1.blogsController.createBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.put('/:id', ...blogValidators, composition_root_1.blogsController.updateBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, blogs_validation_1.blogIdValidation, composition_root_1.blogsController.deleteBlog.bind(composition_root_1.blogsController));
exports.blogsRouter.get('/:blogId/posts', blogs_posts_bind_validation_1.postBlogBindIdExistValidation, blogs_posts_bind_validation_1.blogsPostsBindingInputValidationMiddleware, composition_root_1.blogsController.getPostByBlogId.bind(composition_root_1.blogsController));
exports.blogsRouter.post('/:blogId/posts', ...exports.blogsPostBindValidators, composition_root_1.blogsController.createPostInBlogs.bind(composition_root_1.blogsController));
//# sourceMappingURL=blogs-router.js.map