"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.registrationValidators = void 0;
const users_validation_1 = require("../../users/validation/users-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
exports.registrationValidators = [
    users_validation_1.usersLoginValidation,
    users_validation_1.usersPasswordValidation,
    users_validation_1.usersEmailValidation,
    users_validation_1.userEmailExistValidation,
    users_validation_1.userLoginExistValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const express_1 = require("express");
const tokenValidator_1 = require("../validation/tokenValidator");
const composition_root_1 = require("../../common/composition-root/composition-root");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.get('/me', tokenValidator_1.authorizationTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, composition_root_1.authController.me.bind(composition_root_1.authController));
exports.authRouter.post('/refresh-token', tokenValidator_1.refreshTokenValidator, tokenValidator_1.isUnValidTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, composition_root_1.authController.refreshToken.bind(composition_root_1.authController));
exports.authRouter.post('/login', tokenValidator_1.customRestrictionValidator, composition_root_1.authController.login.bind(composition_root_1.authController));
exports.authRouter.post('/registration', tokenValidator_1.customRestrictionValidator, ...exports.registrationValidators, composition_root_1.authController.registration.bind(composition_root_1.authController));
exports.authRouter.post('/registration-confirmation', tokenValidator_1.customRestrictionValidator, users_validation_1.checkCodeConfirmation, users_validation_1.checkCodeExist, blogs_validation_1.inputValidationMiddleware, composition_root_1.authController.registrationConfirmation.bind(composition_root_1.authController));
exports.authRouter.post('/registration-email-resending', tokenValidator_1.customRestrictionValidator, users_validation_1.checkEmailConfirmation, users_validation_1.userEmailRecendingExistValidation, blogs_validation_1.inputValidationMiddleware, composition_root_1.authController.registrationEmailResending.bind(composition_root_1.authController));
exports.authRouter.post('/password-recovery', tokenValidator_1.customRestrictionValidator, users_validation_1.usersEmailValidation, users_validation_1.userEmailExistValidation, tokenValidator_1.recoveryValidationMiddleware, composition_root_1.authController.passwordRecovery.bind(composition_root_1.authController));
exports.authRouter.post('/new-password', tokenValidator_1.customRestrictionValidator, tokenValidator_1.newPasswordValidation, tokenValidator_1.recoveryValidationMiddleware, composition_root_1.authController.newPassword.bind(composition_root_1.authController));
//# sourceMappingURL=auth-router.js.map