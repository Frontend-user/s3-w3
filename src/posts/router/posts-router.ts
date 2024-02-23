import {Router} from "express";
import {authorizationMiddleware, bearerAuthMiddleware} from "../../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postIdValidation,
    postTitleValidation
} from "../../validation/posts-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";
import {
    commentContentValidation, commentInputValidationMiddleware,
    commentPostIdExistValidation
} from "../../comments/validation/comments-validation";
import {PostsController} from "./posts-controller";
import {postsController} from "../../common/composition-root/composition-root";

export const postValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    postBlogIdValidation,
    postBlogIdExistValidation,
    inputValidationMiddleware
]

export const postsRouter = Router({})


postsRouter.post('/:postId/comments',
    bearerAuthMiddleware,
    commentPostIdExistValidation,
    commentContentValidation,
    commentInputValidationMiddleware, postsController.createCommentByPostId.bind(PostsController))

postsRouter.get('/:postId/comments',
    commentPostIdExistValidation,
    commentInputValidationMiddleware,
    postsController.createCommentByPostId.bind(PostsController))

postsRouter.get('/', postsController.getPosts.bind(PostsController))


postsRouter.get('/:id', postIdValidation, postsController.getPostById.bind(PostsController))

postsRouter.post('/', ...postValidators, postsController.createPost.bind(PostsController))

postsRouter.put('/:id', ...postValidators, postsController.updatePost.bind(PostsController))


postsRouter.delete('/:id',
    authorizationMiddleware,
    postIdValidation, postsController.deletePost.bind(PostsController))