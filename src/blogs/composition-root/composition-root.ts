import {BlogsRepositories} from "../repository/blogs-repositories";
import {BlogsService} from "../domain/blogs-service";
import {BlogsControllerConstructor} from "../router/blogs-controller";

export const blogsRepositories = new BlogsRepositories()
export const blogsService = new BlogsService(blogsRepositories)
export const blogsController = new BlogsControllerConstructor(blogsService)