import {BlogsRepositories} from "../../blogs/repository/blogs-repositories";
import {BlogsService} from "../../blogs/domain/blogs-service";
import {BlogsControllerConstructor} from "../../blogs/router/blogs-controller";
import {BlogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {PostsRepositories} from "../../posts/repositories/posts-repositories";
import {PostsQueryRepository} from "../../posts/posts-query/posts-query-repository";
import {PostsService} from "../../posts/domain/posts-service";
import {PostsController} from "../../posts/router/posts-controller";
import {CommentsRepository} from "../../comments/repository/comments-repository";
import {CommentQueryRepository} from "../../comments/query-repository/comment-query-repository";
import {CommentsService} from "../../comments/service/comments-service";
import {CommentsController} from "../../comments/router/comments-controller";

export const postsQueryRepository = new PostsQueryRepository()
export const blogsRepositories = new BlogsRepositories()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogsService = new BlogsService(blogsRepositories)
export const postsRepositories = new PostsRepositories()
export const postsService = new PostsService(postsRepositories)
export const commentsRepository = new CommentsRepository()
export const commentQueryRepository = new CommentQueryRepository()
export const commentsService = new CommentsService(commentsRepository)
export const postsController = new PostsController(postsQueryRepository, postsService, blogsQueryRepository,commentsService, commentQueryRepository)
export const blogsController = new BlogsControllerConstructor(blogsService, blogsQueryRepository, postsQueryRepository, postsService)
export const commentsController = new CommentsController(commentsService, commentQueryRepository)