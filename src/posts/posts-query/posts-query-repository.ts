import {PostEntityType, PostViewType} from "../../common/types/post-type";
import {PostModel} from "../../db";
import {ObjectId} from "mongodb";
import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {Pagination} from "../../common/types/pagination";
import {changeIdFormat} from "../../common/custom-methods/change-id-format";

export const postsQueryRepository = {
    async getPosts(sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number): Promise<Pagination<PostViewType[]>> {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)


        let posts: PostEntityType[] = await PostModel.find({}).sort(sortQuery).skip(skip).limit(limit).lean()
        const allPosts = await PostModel.find({}).sort(sortQuery).lean()
        let pagesCount = Math.ceil(allPosts.length / newPageSize)
        const fixArrayIds = posts.map((item => changeIdFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }
    },
    async getPostsByBlogId(blogId?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number):Promise<Pagination<PostViewType[]>>  {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)

        let posts: PostEntityType[] = await PostModel.find({"blogId": blogId}).sort(sortQuery).skip(skip).limit(limit).lean()
        const allPosts = await PostModel.find({"blogId": blogId}).lean()
        let pagesCount = Math.ceil(allPosts.length / newPageSize)

        const fixArrayIds = posts.map((item => changeIdFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }
    },

    async getPostById(id: string): Promise<PostViewType | boolean> {
        const post: PostEntityType | null = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        return post ?  changeIdFormat(post) : false
    },



}
