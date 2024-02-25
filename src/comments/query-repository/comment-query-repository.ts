import {CommentModel} from "../../db";
import {ObjectId} from "mongodb";
import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {LIKE_STATUSES} from "../../common/constants/http-statuses";
import {currentUser} from "../../application/current-user";
export class CommentQueryRepository {
    async getCommentsByPostId(postId: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        const comments = await CommentModel.find({postId: postId}).sort(sortQuery).skip(skip).limit(limit).lean()
        const allComments = await CommentModel.find({postId: postId}).sort(sortQuery).lean()

        let pagesCount = Math.ceil(allComments.length / newPageSize)
        const fixArrayIds = comments.map((item => this.changeCommentFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allComments.length,
            "items": fixArrayIds
        }

    }
    async getCommentById(commentId: ObjectId) {
        const comment = await CommentModel.findOne({_id: commentId}).lean()
        if(comment && !currentUser.userId){
            let usersLikeStatuses:any = comment!.likesInfo.usersLikeStatuses
            comment.likesInfo.myStatus = LIKE_STATUSES.NONE
        }
        if(comment && currentUser.userId){
            let usersLikeStatuses:any[] | undefined = comment!.likesInfo.usersLikeStatuses
            if(usersLikeStatuses && usersLikeStatuses.length > 0){
                let info = usersLikeStatuses.find(o=>o.userId ===currentUser.userId)
                comment.likesInfo.myStatus = info.likeStatus
            }
        }
        return comment ? this.changeCommentFormat(comment) : false
    }

    changeCommentFormat (obj: any){

        obj.id = obj._id
        delete obj._id
        delete obj.likesInfo.usersLikeStatuses
        delete obj.__v
        delete obj.postId
        return obj
    }
}
