import {ObjectId} from "mongodb";
import { BlogUpdateType} from "../../common/types/blog-type";
import {BlogsRepositories} from "../repository/blogs-repositories";
import {BlogClass } from "../blogs-classes";

export class BlogsService {
    constructor(protected blogsRepositories:BlogsRepositories) {
    }
    async createBlog(blog:BlogUpdateType): Promise<false | ObjectId> {
        let newBlog = new BlogClass(blog.name,blog.description,blog.websiteUrl)
        const newBlogId = await this.blogsRepositories.createBlog(newBlog)
        return newBlogId ? newBlogId : false
    }

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        return await this.blogsRepositories.updateBlog(id, updateBlog)
    }

    async deleteBlog(id: ObjectId): Promise<boolean> {
        return await this.blogsRepositories.deleteBlog(id)
    }
}
