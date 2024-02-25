import {CommentCreateType } from "../types/comment-type";
import {currentUser} from "../../application/current-user";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repository/comments-repository";

export class CommentsService {
    constructor(protected commentsRepository:CommentsRepository) {
    }
    async createComment(comment: string, postId: string) {
        const newComment: CommentCreateType = {
            content: comment,
            postId: postId,
            commentatorInfo: {
                userId: currentUser.userId,
                userLogin: currentUser.userLogin
            },
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                usersLikeStatuses:[]
            },
            createdAt: new Date().toISOString()
        }
        const response = await this.commentsRepository.createComment(newComment)
        return response
    }

    async updateComment(id: ObjectId, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, {content: content})
    }
    async updateCommentLikeStatus(id: ObjectId, likeStatus: string): Promise<boolean> {
        return await this.commentsRepository.updateCommentLikeStatus(id, likeStatus)
    }
    async deleteComment(id: ObjectId): Promise<boolean > {
        return await this.commentsRepository.deleteCommentById(id)
    }
}
