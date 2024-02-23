import {commentsRepository} from "../repository/comments-repository";
import {CommentCreateType } from "../types/comment-type";
import {currentUser} from "../../application/current-user";
import {ObjectId} from "mongodb";

export const commentsService = {
    async createComment(comment: string, postId: string) {
        const newComment: CommentCreateType = {
            content: comment,
            postId: postId,
            commentatorInfo: {
                userId: currentUser.userId,
                userLogin: currentUser.userLogin
            },
            createdAt: new Date().toISOString()
        }
        const response = await commentsRepository.createComment(newComment)
        return response
    },

    async updateComment(id: ObjectId, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, {content: content})
    },
    async deleteComment(id: ObjectId): Promise<boolean > {
        return await commentsRepository.deleteCommentById(id)
    },

}