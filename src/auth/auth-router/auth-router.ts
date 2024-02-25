import {checkCodeConfirmation, checkCodeExist, checkEmailConfirmation,
    userEmailExistValidation, userEmailRecendingExistValidation,
    userLoginExistValidation,
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation
} from "../../users/validation/users-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";

export const registrationValidators = [
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    userEmailExistValidation,
    userLoginExistValidation,
    inputValidationMiddleware,
]

import {Router} from "express";
import {
    authorizationTokenMiddleware,
    customRestrictionValidator,
    isUnValidTokenMiddleware, newPasswordValidation,
    recoveryValidationMiddleware,
    refreshTokenValidator,
    tokenValidationMiddleware,
} from "../validation/tokenValidator";
import {authController} from "../../common/composition-root/composition-root";


export const authRouter = Router({})

authRouter.get('/me',
    authorizationTokenMiddleware,
    tokenValidationMiddleware,
    authController.me.bind(authController))

authRouter.post('/refresh-token',
    refreshTokenValidator,
    isUnValidTokenMiddleware,
    tokenValidationMiddleware,
    authController.refreshToken.bind(authController))

authRouter.post('/login', customRestrictionValidator,
    authController.login.bind(authController))

authRouter.post('/registration',
    customRestrictionValidator, ...registrationValidators,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    customRestrictionValidator, checkCodeConfirmation,
    checkCodeExist, inputValidationMiddleware,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    customRestrictionValidator, checkEmailConfirmation,
    userEmailRecendingExistValidation, inputValidationMiddleware,
    authController.registrationEmailResending.bind(authController))

authRouter.post('/password-recovery',
    customRestrictionValidator, usersEmailValidation,
    userEmailExistValidation, recoveryValidationMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password', customRestrictionValidator,
    newPasswordValidation, recoveryValidationMiddleware,
    authController.newPassword.bind(authController))

