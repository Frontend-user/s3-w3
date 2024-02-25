"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.registrationValidators = void 0;
const users_validation_1 = require("../../users/validation/users-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const jwt = require('jsonwebtoken');
exports.registrationValidators = [
    users_validation_1.usersLoginValidation,
    users_validation_1.usersPasswordValidation,
    users_validation_1.usersEmailValidation,
    users_validation_1.userEmailExistValidation,
    users_validation_1.userLoginExistValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const authValidators = [
    users_validation_1.usersPasswordValidation,
    users_validation_1.authLoginOrEmailValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const express_1 = require("express");
const http_statuses_1 = require("../../common/constants/http-statuses");
const auth_service_1 = require("../auth-domain/auth-service");
const jwt_service_1 = require("../../application/jwt-service");
const current_user_1 = require("../../application/current-user");
const users_query_repository_1 = require("../../users/query-repository/users-query-repository");
const mongodb_1 = require("mongodb");
const auth_repository_1 = require("../auth-repository/auth-repository");
const tokenValidator_1 = require("../validation/tokenValidator");
const security_service_1 = require("../../security/domain/security-service");
const uuid_1 = require("uuid");
const query_security_repository_1 = require("../../security/query-repository/query-security-repository");
const security_repository_1 = require("../../security/repositories/security-repository");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.get('/me', tokenValidator_1.authorizationTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization.split(' ')[1];
    let userId = yield jwt_service_1.jwtService.checkToken(token);
    const getUserByID = yield users_query_repository_1.usersQueryRepository.getUserById(new mongodb_1.ObjectId(userId));
    if (!getUserByID) {
        res.sendStatus(401);
        return;
    }
    if (getUserByID) {
        current_user_1.currentUser.userLogin = getUserByID.login;
        current_user_1.currentUser.userId = userId;
        res.send({
            "email": getUserByID.email,
            "login": getUserByID.login,
            "userId": getUserByID.id
        });
        return;
    }
    else {
        res.sendStatus(401);
        return;
    }
}));
exports.authRouter.post('/logout', tokenValidator_1.refreshTokenValidator, tokenValidator_1.isUnValidTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getRefreshToken = req.cookies.refreshToken;
    const userId = yield jwt_service_1.jwtService.checkRefreshToken(getRefreshToken);
    if (!userId) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
        return;
    }
    const oldTokenData = yield jwt_service_1.jwtService.getRefreshToken(getRefreshToken);
    const isError = yield query_security_repository_1.querySecurityRepositories.getDeviceByDateAndDeviceId(oldTokenData);
    if (!isError) {
        res.sendStatus(401);
        return;
    }
    const tokenData = yield jwt_service_1.jwtService.getRefreshToken(req.cookies.refreshToken);
    const deviceId = tokenData ? tokenData.deviceId : '0';
    yield security_repository_1.securityRepositories.deleteDeviceById(deviceId);
    yield auth_repository_1.authRepositories.addUnValidRefreshToken(getRefreshToken);
    current_user_1.currentUser.userId = '';
    current_user_1.currentUser.userLogin = '';
    res.sendStatus(204);
}));
exports.authRouter.post('/refresh-token', tokenValidator_1.refreshTokenValidator, tokenValidator_1.isUnValidTokenMiddleware, tokenValidator_1.tokenValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getRefreshToken = req.cookies.refreshToken;
    const userId = yield jwt_service_1.jwtService.checkRefreshToken(getRefreshToken);
    if (!userId) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
        return;
    }
    const oldTokenData = yield jwt_service_1.jwtService.getRefreshToken(getRefreshToken);
    const isError = yield query_security_repository_1.querySecurityRepositories.getDeviceByDateAndDeviceId(oldTokenData);
    if (!isError) {
        res.sendStatus(401);
        return;
    }
    const tokenData = yield jwt_service_1.jwtService.getRefreshToken(req.cookies.refreshToken);
    const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(userId, tokenData.deviceId);
    yield security_repository_1.securityRepositories.updateDevice(refreshToken);
    const token = yield jwt_service_1.jwtService.createJWT(userId);
    yield auth_repository_1.authRepositories.addUnValidRefreshToken(getRefreshToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.send({ accessToken: token });
}));
exports.authRouter.post('/login', tokenValidator_1.customRestrictionValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authData = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
        };
        const response = yield auth_service_1.authService.authUser(authData);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
            return;
        }
        const createdDeviceId = (0, uuid_1.v4)();
        const user = yield auth_repository_1.authRepositories.getUserIdByAutData(authData);
        if (user) {
            current_user_1.currentUser.userId = user._id;
            current_user_1.currentUser.userLogin = user.accountData.login;
            const token = yield jwt_service_1.jwtService.createJWT(user._id);
            const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(user._id, createdDeviceId);
            const dataToken = yield jwt_service_1.jwtService.getRefreshToken(refreshToken);
            yield security_service_1.securityService.createDevice({
                userId: String(user._id),
                ip: req.ip,
                title: (_a = req.headers['user-agent']) !== null && _a !== void 0 ? _a : 'string',
                lastActiveDate: new Date(dataToken.iat).toISOString(),
                deviceId: createdDeviceId
            });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.send({ accessToken: token });
        }
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration', tokenValidator_1.customRestrictionValidator, ...exports.registrationValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInputData = {
            login: req.body.login,
            email: req.body.email,
            password: req.body.password,
        };
        const response = yield auth_service_1.authService.registration(userInputData);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration-confirmation', tokenValidator_1.customRestrictionValidator, users_validation_1.checkCodeConfirmation, users_validation_1.checkCodeExist, blogs_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield auth_service_1.authService.registrationConfirm(req.body.code);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/registration-email-resending', tokenValidator_1.customRestrictionValidator, users_validation_1.checkEmailConfirmation, users_validation_1.userEmailRecendingExistValidation, blogs_validation_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield auth_service_1.authService.registrationEmailResending(req.body.email);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            return;
        }
        res.send(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.authRouter.post('/password-recovery', tokenValidator_1.customRestrictionValidator, users_validation_1.usersEmailValidation, users_validation_1.userEmailExistValidation, tokenValidator_1.recoveryValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let resp = yield auth_service_1.authService.recoveryCodeEmailSend(req.body.email);
        res.sendStatus(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
    }
}));
exports.authRouter.post('/new-password', tokenValidator_1.customRestrictionValidator, tokenValidator_1.newPasswordValidation, tokenValidator_1.recoveryValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newPassword = {
            newPassword: req.body.newPassword,
            recoveryCode: req.body.recoveryCode
        };
        let response = yield auth_service_1.authService.createNewPassword(newPassword);
        if (!response) {
            res.status(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400).send({ errorsMessages: [{ message: 'String', field: "recoveryCode" }] });
            return;
        }
        res.sendStatus(204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
    }
}));
//# sourceMappingURL=auth-router.js.map