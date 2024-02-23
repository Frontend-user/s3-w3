import {Request, Response} from "express";
import {BlogUpdateType, BlogViewType} from "../../common/types/blog-type";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";

import {ObjectId} from "mongodb";
import {BlogsService} from "../domain/blogs-service";
import {getQueryData} from "../../common/custom-methods/query-data";
import {PostCreateType, PostViewType} from "../../common/types/post-type";
import {PostsService} from "../../posts/domain/posts-service";
import {BlogsQueryRepository} from "../blogs-query/blogs-query-repository";
import {PostsQueryRepository} from "../../posts/posts-query/posts-query-repository";

export const blogs: BlogViewType[] = []

export class BlogsControllerConstructor {
    constructor(protected blogsService: BlogsService,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository,
                protected postsService: PostsService) {
    }

    async getBlogs(req: Request, res: Response) {
        try {
            let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)
            let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined

            const blogs = await this.blogsQueryRepository.getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize)
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }

    async getBlogById(req: Request, res: Response) {
        const blog = await this.blogsQueryRepository.getBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OK_200).send(blog)
    }

    async createBlog(req: Request, res: Response) {
        try {
            const newBlog: BlogUpdateType = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            }
            const response: ObjectId | false = await this.blogsService.createBlog(newBlog)
            if (response) {
                const createdBlog: BlogViewType | boolean = await this.blogsQueryRepository.getBlogById(String(response))
                res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
                return
            }

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    }

    async updateBlog(req: Request, res: Response) {
        let
            blogDataToUpdate: BlogUpdateType = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            }

        try {
            const response: boolean = await this.blogsService.updateBlog(new ObjectId(req.params.id), blogDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch
            (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        try {
            const response: boolean = await this.blogsService.deleteBlog(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }

    async getPostByBlogId(req: Request, res: Response) {
        let {sortBy, sortDirection, pageNumber, pageSize} = getQueryData(req)

        try {
            const posts = await this.postsQueryRepository.getPostsByBlogId(String(req.params.blogId), sortBy, sortDirection, pageNumber, pageSize)
            res.send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }

    async createPostInBlogs(req: Request, res: Response) {
        let getBlogName
        const getBlog: BlogViewType | boolean = await this.blogsQueryRepository.getBlogById(req.params.blogId)
        if (getBlog) {
            getBlogName = getBlog.name
            let newPost: PostCreateType = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.params.blogId,
                blogName: getBlogName,
                createdAt: new Date().toISOString()
            }

            try {
                const response = await this.postsService.createPost(newPost)
                const createdPost: PostViewType | boolean = await this.postsQueryRepository.getPostById(String(response))
                if (!createdPost) {
                    res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
                    return
                }
                res.status(HTTP_STATUSES.CREATED_201).send(createdPost)


            } catch (error) {
                res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
            }
        }
    }
}
