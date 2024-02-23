import {blogsController} from "../composition-root/composition-root";
import {
    blogDescValidation,
    blogIdValidation,
    blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../../validation/blogs-validation";
import {authorizationMiddleware} from "../../validation/auth-validation";
import {Router} from "express";

const blogValidators = [
    authorizationMiddleware,
    blogDescValidation,
    blogNameValidation,
    blogWebUrlValidation,
    blogWebUrlValidation2,
    inputValidationMiddleware,
]
export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', blogIdValidation, blogsController.getBlogById.bind(blogsController))
blogsRouter.post('/', ...blogValidators, blogsController.createBlog.bind(blogsController))
blogsRouter.put('/:id', ...blogValidators, blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authorizationMiddleware, blogIdValidation, blogsController.deleteBlog.bind(blogsController))


