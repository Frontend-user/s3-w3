import {CommentModel} from "../../db";
import {ObjectId} from "mongodb";
import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {LIKE_STATUSES} from "../../common/constants/http-statuses";
import {JwtService} from "../../application/jwt-service";

export class CommentQueryRepository {
    constructor(protected jwtService: JwtService) {
    }

    async getCommentsByPostId(postId: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number, auth?: string | undefined) {

        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        const comments = await CommentModel.find({postId: postId}).sort(sortQuery).skip(skip).limit(limit).lean()
        const allComments = await CommentModel.find({postId: postId}).sort(sortQuery).lean()

        let pagesCount = Math.ceil(allComments.length / newPageSize)
        let getRightLikeStatuses: any = []
        for (let i = 0; i < comments.length; i++) {
            let s = await this.getCommentById(undefined, auth, comments[i])
            getRightLikeStatuses.push(s)
        }
        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allComments.length,
            "items": getRightLikeStatuses
        }

    }

    async getCommentById(commentId: ObjectId | undefined, auth?: string | undefined, getComment?: any) {
        let comment: any
        if (!getComment && commentId) {
            comment = await CommentModel.findOne({_id: commentId}).lean()
        } else {
            comment = getComment
        }
        let accessUserId: undefined | string
        if (auth) {
            accessUserId = await this.jwtService.checkToken(auth.split(' ')[1])
        }
        if (accessUserId) {
            let usersLikeStatuses: any[] | undefined = comment!.likesInfo.usersLikeStatuses
            if (usersLikeStatuses && usersLikeStatuses.length > 0) {
                let info = usersLikeStatuses.find(o => o.userId === accessUserId)
                if (info) {
                    comment!.likesInfo.myStatus = info.likeStatus
                } else {
                    comment!.likesInfo.myStatus = LIKE_STATUSES.NONE
                }
            }
        } else {
            comment!.likesInfo.myStatus = LIKE_STATUSES.NONE
        }
        return comment ? this.changeCommentFormat(comment) : false
    }

    changeCommentFormat(obj: any) {

        obj.id = obj._id
        delete obj._id
        delete obj.likesInfo.usersLikeStatuses
        delete obj.__v
        delete obj.postId
        return obj
    }
}
