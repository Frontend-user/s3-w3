import {BlogModel} from "../../db";
import {ObjectId, SortDirection} from "mongodb";
import {BlogEntityType, BlogViewType} from "../../common/types/blog-type";
import {blogsSorting} from "./utils/blogs-sorting";
import {blogsFinding} from "./utils/blogs-finding";
import {blogsPaginate} from "./utils/blogs-paginate";
import {Pagination} from "../../common/types/pagination";
import {changeIdFormat} from "../../common/custom-methods/change-id-format";


export const blogsQueryRepository = {

    async getBlogs(searchNameTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const findQuery = blogsFinding.getFindings(searchNameTerm)
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        let blogs: BlogEntityType[] = await BlogModel.find(findQuery).sort(sortQuery).skip(skip).limit(limit).lean();
        const allBlogs = await BlogModel.find(findQuery).sort(sortQuery).lean()
        let pagesCount = Math.ceil(allBlogs.length / newPageSize)


        const fixArrayIds: BlogViewType[] = blogs.map((item => changeIdFormat(item)))
        const response: Pagination<BlogViewType[]> = {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allBlogs.length,
            "items": fixArrayIds
        }

        return response
    },

    async getBlogById(id: string): Promise<BlogViewType | false> {
        const blog: BlogEntityType | null = await BlogModel.findOne({_id: new ObjectId(id)}).lean()
        return blog ? changeIdFormat(blog) : false
    },

}