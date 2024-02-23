"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsPostBindValidators = exports.blogsPostsBindRouter = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../validation/auth-validation");
const posts_validation_1 = require("../validation/posts-validation");
const blogs_posts_bind_validation_1 = require("../validation/blogs-posts-bind-validation");
exports.blogsPostsBindRouter = (0, express_1.Router)({});
exports.blogsPostBindValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    // postBlogsBindingBlogIdValidation,
    blogs_posts_bind_validation_1.postBlogBindIdExistValidation,
    blogs_posts_bind_validation_1.blogsPostsBindingInputValidationMiddleware
];
//# sourceMappingURL=blogs-posts-bindings-router.js.map