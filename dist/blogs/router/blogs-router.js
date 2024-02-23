"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const composition_root_1 = require("../composition-root/composition-root");
const blogs_validation_1 = require("../../validation/blogs-validation");
const auth_validation_1 = require("../../validation/auth-validation");
const express_1 = require("express");
const blogValidators = [
    auth_validation_1.authorizationMiddleware,
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
//# sourceMappingURL=blogs-router.js.map