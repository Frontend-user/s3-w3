import {CommentCreateType} from "../types/comment-type";
import {CommentModel } from "../../db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async createComment(comment: CommentCreateType): Promise<false | ObjectId> {
        let response = await CommentModel.create(comment);
        return response ? response._id : false
    },

    async updateComment(id: ObjectId, updateComment: {
        content: string
    }): Promise<boolean> {
        const response = await CommentModel.updateOne({_id: id},  updateComment)
        return response.matchedCount === 1;
    },

    async deleteCommentById(commentId: ObjectId) {
        const comment = await CommentModel.deleteOne({_id: commentId})
        return !!comment
    },

}