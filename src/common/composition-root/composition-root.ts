import {BlogsRepositories} from "../../blogs/repository/blogs-repositories";
import {BlogsService} from "../../blogs/domain/blogs-service";
import {BlogsControllerConstructor} from "../../blogs/router/blogs-controller";
import {BlogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {PostsRepositories} from "../../posts/repositories/posts-repositories";
import {PostsQueryRepository} from "../../posts/posts-query/posts-query-repository";
import {PostsService} from "../../posts/domain/posts-service";
import {PostsController} from "../../posts/router/posts-controller";

//blogs
export const postsQueryRepository = new PostsQueryRepository()
export const blogsRepositories = new BlogsRepositories()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogsService = new BlogsService(blogsRepositories)
export const postsRepositories = new PostsRepositories()
export const postsService = new PostsService(postsRepositories)

export const postsController = new PostsController(postsQueryRepository, postsService)
export const blogsController = new BlogsControllerConstructor(blogsService, blogsQueryRepository, postsQueryRepository, postsService)