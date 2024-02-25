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
exports.newPasswordValidation = exports.recoveryValidationMiddleware = exports.customRestrictionValidator = exports.tokenValidationMiddleware = exports.refreshTokenValidator = exports.isUnValidTokenMiddleware = exports.authorizationTokenMiddleware = void 0;
const express_validator_1 = require("express-validator");
const composition_root_1 = require("../../common/composition-root/composition-root");
exports.authorizationTokenMiddleware = (0, express_validator_1.header)('authorization').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!value) {
        throw new Error('Wrong authorization');
    }
    let token = value.split(' ')[1];
    if (!token) {
        throw new Error('Wrong authorization');
    }
    let userId;
    try {
        userId = yield composition_root_1.jwtService.checkToken(token);
        if (!userId) {
            throw new Error('Wrong authorization');
        }
    }
    catch (e) {
        throw new Error('Wrong authorization');
    }
})).withMessage({
    message: 'authorization wrong',
    field: 'authorization'
});
exports.isUnValidTokenMiddleware = (0, express_validator_1.cookie)('refreshToken').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    let unValidTokens = yield composition_root_1.authRepositories.getUnValidRefreshTokens();
    let find = unValidTokens.filter((item) => item.refreshToken === value);
    if (find.length > 0) {
        throw new Error('Wrong refreshToken');
    }
    return true;
}));
exports.refreshTokenValidator = (0, express_validator_1.cookie)('refreshToken').custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = value;
    const isExpired = yield composition_root_1.jwtService.checkRefreshToken(refreshToken);
    if (isExpired && refreshToken) {
        return true;
    }
    else {
        throw new Error('Wrong refreshToken');
    }
})).withMessage({
    message: 'error refreshToken',
    field: 'refreshToken'
});
const tokenValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
        }
        res.sendStatus(401);
        return;
    }
    else {
        next();
    }
};
exports.tokenValidationMiddleware = tokenValidationMiddleware;
let requestArray = {};
const customRestrictionValidator = (req, res, next) => {
    let now = Date.now();
    let url = req.originalUrl + req.ip;
    if (!requestArray[url]) {
        requestArray[url] = [];
    }
    if (requestArray[url].length >= 4 && (now - requestArray[url].slice(-5)[0]) < 10000) {
        res.sendStatus(429);
        return;
    }
    else {
        requestArray[url].push(now);
        next();
    }
};
exports.customRestrictionValidator = customRestrictionValidator;
const recoveryValidationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
    if (errors.length) {
        let errorsForClient = [];
        for (const error of errors) {
            errorsForClient.push(error.msg);
            if (error.msg.message === 'email not exist') {
                res.sendStatus(204);
                return;
            }
        }
        res.status(400).json({ errorsMessages: errorsForClient });
        return;
    }
    else {
        next();
    }
};
exports.recoveryValidationMiddleware = recoveryValidationMiddleware;
exports.newPasswordValidation = (0, express_validator_1.body)('newPassword').trim().isString().isLength({ min: 6, max: 20 }).withMessage({
    message: 'newPassword is unvalid',
    field: 'newPassword'
});
//# sourceMappingURL=tokenValidator.js.map