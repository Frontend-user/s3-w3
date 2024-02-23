import {Router} from "express";

import { bearerAuthMiddleware} from "../../validation/auth-validation";
import {
    commentContentValidation, commentDeleteInputValidationMiddleware,
    commentIdExistValidation,
    commentInputValidationMiddleware, haveAccesForUpdate
} from "../validation/comments-validation";
import {commentsController} from "../../common/composition-root/composition-root";

export const commentsRouter = Router({})


commentsRouter.put('/:commentId', bearerAuthMiddleware, commentContentValidation, commentIdExistValidation, haveAccesForUpdate, commentInputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))


commentsRouter.delete('/:commentId', bearerAuthMiddleware, commentIdExistValidation, haveAccesForUpdate, commentDeleteInputValidationMiddleware,
    commentsController.deleteCommentById.bind(commentsController) )

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController) )