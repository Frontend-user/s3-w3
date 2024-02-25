import {Request, Response} from "express";
import {getQueryData} from "../../common/custom-methods/query-data";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {PostsQueryRepository} from "../posts-query/posts-query-repository";
import {BlogViewType} from "../../common/types/blog-type";
import {PostCreateType, PostViewType} from "../../common/types/post-type";
import {ObjectId} from "mongodb";
import {PostsService} from "../domain/posts-service";
import {BlogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {CommentsService} from "../../comments/service/comments-service";
import {CommentQueryRepository} from "../../comments/query-repository/comment-query-repository";

export class PostsController {
    constructor(protected postsQueryRepository:PostsQueryRepository,
                protected postsService:PostsService,
                protected blogsQueryRepository:BlogsQueryRepository,
                protected commentsService:CommentsService,
                protected commentQueryRepository:CommentQueryRepository) {
    }
    async createCommentByPostId(req: Request, res: Response) {
        const commentContent: string = req.body.content
        const postId: string = req.params.postId
        const commentId = await this.commentsService.createComment(commentContent, postId)
        if (!commentId) {
            res.sendStatus(404)
        } else {
            const comment = await this.commentQueryRepository.getCommentById(commentId)
            delete comment.postId
            res.status(201).send(comment)
        }
    }

    async getCommentByPostId(req: Request, res: Response) {
        let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

        const postId: string = req.params.postId

        try {
            const comment = await this.commentQueryRepository.getCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize,req.headers.authorization)
            res.status(200).send(comment)

        } catch (e) {
            res.send(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }

    async getPosts(req: Request, res: Response) {
        try {
            let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)
            const posts = await this.postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize)
            res.status(HTTP_STATUSES.OK_200).send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }

    async getPostById(req: Request, res: Response) {
        try {
            const post = await this.postsQueryRepository.getPostById(req.params.id)
            if (!post) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUSES.OK_200).send(post)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async createPost(req: Request, res: Response) {
        let getBlogName
        const getBlog: BlogViewType | boolean = await this.blogsQueryRepository.getBlogById(req.body.blogId)
        if (getBlog) {
            getBlogName = getBlog.name
            let newPost: PostCreateType = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId,
                blogName: getBlogName,
                createdAt: new Date().toISOString()
            }

            try {
                const response = await this.postsService.createPost(newPost)
                if (response) {

                    const createdPost: PostViewType | boolean = await this.postsQueryRepository.getPostById(response)
                    res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
                    return

                }
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
                return
            } catch (error) {
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
            }
        }


    }

    async updatePost(req: Request, res: Response) {
        let postDataToUpdate = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        try {
            const response: boolean = await this.postsService.updatePost(new ObjectId(req.params.id), postDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const response: boolean = await this.postsService.deletePost(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
}