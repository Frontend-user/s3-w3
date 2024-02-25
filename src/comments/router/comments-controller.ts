import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {CommentsService} from "../service/comments-service";
import {CommentQueryRepository} from "../query-repository/comment-query-repository";

export class CommentsController {
    constructor(protected commentsService:CommentsService, protected commentQueryRepository: CommentQueryRepository) {
    }
    async updateComment(req: Request, res: Response){
        try {
            const response: boolean = await this.commentsService.updateComment(new ObjectId(req.params.commentId), req.body.content)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
    async updateCommentLikeStatus(req: Request, res: Response){
        try {
            const response: boolean = await this.commentsService.updateCommentLikeStatus(new ObjectId(req.params.commentId), req.body.likeStatus)
            let comment = await this.commentQueryRepository.getCommentById(new ObjectId(req.params.commentId), req.headers.authorization)
            // res.send(comment)
            console.log(comment,'updateCommentLikeStatus')
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
    async deleteCommentById(req: Request, res: Response) {
        try {
            const response: boolean = await this.commentsService.deleteComment(new ObjectId(req.params.commentId))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentQueryRepository.getCommentById(new ObjectId(req.params.id), req.headers.authorization)
        console.log(comment,'comment')
        return comment ? res.send(comment) : res.sendStatus(404)
    }
}
