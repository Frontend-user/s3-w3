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
exports.AuthController = void 0;
const mongodb_1 = require("mongodb");
const current_user_1 = require("../../application/current-user");
const http_statuses_1 = require("../../common/constants/http-statuses");
const uuid_1 = require("uuid");
class AuthController {
    constructor(authService, usersQueryRepository, jwtService, querySecurityRepositories, securityRepositories, authRepositories, securityService) {
        this.authService = authService;
        this.usersQueryRepository = usersQueryRepository;
        this.jwtService = jwtService;
        this.querySecurityRepositories = querySecurityRepositories;
        this.securityRepositories = securityRepositories;
        this.authRepositories = authRepositories;
        this.securityService = securityService;
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = req.headers.authorization.split(' ')[1];
            let userId = yield this.jwtService.checkToken(token);
            const getUserByID = yield this.usersQueryRepository.getUserById(new mongodb_1.ObjectId(userId));
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
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const getRefreshToken = req.cookies.refreshToken;
            const userId = yield this.jwtService.checkRefreshToken(getRefreshToken);
            if (!userId) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
                return;
            }
            const oldTokenData = yield this.jwtService.getRefreshToken(getRefreshToken);
            const isError = yield this.querySecurityRepositories.getDeviceByDateAndDeviceId(oldTokenData);
            if (!isError) {
                res.sendStatus(401);
                return;
            }
            const tokenData = yield this.jwtService.getRefreshToken(req.cookies.refreshToken);
            const refreshToken = yield this.jwtService.createRefreshToken(userId, tokenData.deviceId);
            yield this.securityRepositories.updateDevice(refreshToken);
            const token = yield this.jwtService.createJWT(userId);
            yield this.authRepositories.addUnValidRefreshToken(getRefreshToken);
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
            res.send({ accessToken: token });
        });
    }
    login(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authData = {
                    loginOrEmail: req.body.loginOrEmail,
                    password: req.body.password,
                };
                const response = yield this.authService.authUser(authData);
                if (!response) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
                    return;
                }
                const createdDeviceId = (0, uuid_1.v4)();
                const user = yield this.authRepositories.getUserIdByAutData(authData);
                if (user) {
                    current_user_1.currentUser.userId = user._id;
                    current_user_1.currentUser.userLogin = user.accountData.login;
                    const token = yield this.jwtService.createJWT(user._id);
                    const refreshToken = yield this.jwtService.createRefreshToken(user._id, createdDeviceId);
                    const dataToken = yield this.jwtService.getRefreshToken(refreshToken);
                    yield this.securityService.createDevice({
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
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInputData = {
                    login: req.body.login,
                    email: req.body.email,
                    password: req.body.password,
                };
                const response = yield this.authService.registration(userInputData);
                if (!response) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
                    return;
                }
                res.send(204);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.registrationConfirm(req.body.code);
                if (!response) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
                    return;
                }
                res.send(204);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.registrationEmailResending(req.body.email);
                if (!response) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
                    return;
                }
                res.send(204);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp = yield this.authService.recoveryCodeEmailSend(req.body.email);
                res.sendStatus(204);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            }
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newPassword = {
                    newPassword: req.body.newPassword,
                    recoveryCode: req.body.recoveryCode
                };
                let response = yield this.authService.createNewPassword(newPassword);
                if (!response) {
                    res.status(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400).send({ errorsMessages: [{ message: 'String', field: "recoveryCode" }] });
                    return;
                }
                res.sendStatus(204);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SOMETHING_WRONG_400);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth-controller.js.map