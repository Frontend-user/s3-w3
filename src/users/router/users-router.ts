import { Router} from "express";
import {
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation,

} from "../validation/users-validation";
import {blogIdValidation, inputValidationMiddleware} from "../../validation/blogs-validation";

import {authorizationMiddleware} from "../../validation/auth-validation";
import {usersController} from "../../common/composition-root/composition-root";

export const usersValidators = [
    authorizationMiddleware,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    inputValidationMiddleware,
]
export const usersRouter = Router({})


usersRouter.get('/',
    authorizationMiddleware,
    usersController.getUsers.bind(usersController) )


usersRouter.post('/',
    ...usersValidators,
    usersController.createUser.bind(usersController) )


usersRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    usersController.deleteUser.bind(usersController) )

