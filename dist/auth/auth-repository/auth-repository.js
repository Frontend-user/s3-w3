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
exports.authRepositories = void 0;
const db_1 = require("../../db");
const nodemailer_service_1 = require("../../application/nodemailer-service");
const uuid_1 = require("uuid");
exports.authRepositories = {
    authUser(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.UserModel.find({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] }).lean();
            return !!response;
        });
    },
    getUserHash(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.UserModel.findOne({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] }).lean();
            return response ? response : false;
        });
    },
    getUserIdByAutData(auth) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.UserModel.findOne({ $or: [{ 'accountData.login': auth.loginOrEmail }, { 'accountData.email': auth.loginOrEmail }] }).lean();
            return response ? response : false;
        });
    },
    getConfirmCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.UserModel.findOne({ 'emailConfirmation.confirmationCode': code }).lean();
            if (getUser) {
                const respUpdate = yield db_1.UserModel.updateOne({ _id: getUser._id }, { isConfirmed: true });
                return respUpdate.modifiedCount === 1;
            }
            return false;
        });
    },
    addUnValidRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.TokenModel.create(refreshToken);
        });
    },
    getUnValidRefreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield db_1.TokenModel.find({}).lean();
            return tokens;
        });
    },
    recoveryCodeEmailSend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.UserModel.findOne({ 'accountData.email': email }).lean();
            let id = getUser ? getUser._id : null;
            if (id) {
                const recoveryCode = (0, uuid_1.v4)();
                yield db_1.RecoveryCodeModel.create({
                    email,
                    recoveryCode,
                    userId: id
                });
                yield nodemailer_service_1.nodemailerService.sendRecoveryCode(recoveryCode, email);
                return true;
            }
            return false;
        });
    },
    createNewPassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
    registrationEmailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.UserModel.findOne({ 'accountData.email': email }).lean();
            if (getUser) {
                const newCode = (0, uuid_1.v4)();
                const respUpdate = yield db_1.UserModel.updateOne({ _id: getUser._id }, { 'emailConfirmation.confirmationCode': newCode });
                if (respUpdate.matchedCount === 1) {
                    yield nodemailer_service_1.nodemailerService.send(newCode, email);
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        });
    },
};
//# sourceMappingURL=auth-repository.js.map