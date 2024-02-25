import {ObjectId} from "mongodb";
import {usersIdsLikeStatuses} from "../../schemas/schemas";

export type CommentEntity = {
    _id: string
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string
        usersLikeStatuses?: usersIdsLikeStatuses[]
    },
    createdAt: string
}
export type CommentCreateType = Omit<CommentEntity, '_id'>