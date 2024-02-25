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
exports.AuthService = void 0;
const uuid_1 = require("uuid");
const add_1 = require("date-fns/add");
const bcrypt = require('bcrypt');
class AuthService {
    constructor(authRepositories, jwtService, usersRepositories, nodemailerService) {
        this.authRepositories = authRepositories;
        this.jwtService = jwtService;
        this.usersRepositories = usersRepositories;
        this.nodemailerService = nodemailerService;
    }
    authUser(authData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExistLogin = yield this.authRepositories.authUser(authData);
            const res = yield this.authRepositories.getUserHash(authData);
            if (res && isExistLogin) {
                const passwordSalt = res.passwordSalt;
                const passwordHash = res.passwordHash;
                const newPasswordHash = yield bcrypt.hash(authData.password, passwordSalt);
                return newPasswordHash === passwordHash;
            }
            else {
                return false;
            }
        });
    }
    registration(userInputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield this.jwtService.generateSalt(10);
            const passwordHash = yield this.jwtService.generateHash(userInputData.password, passwordSalt);
            const userEmailEntity = {
                accountData: {
                    login: userInputData.login,
                    email: userInputData.email,
                    createdAt: new Date().toISOString(),
                },
                passwordSalt,
                passwordHash,
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.add)(new Date(), { hours: 1, minutes: 3 })
                },
                isConfirmed: false,
                isCreatedFromAdmin: false
            };
            const mailSendResponse = yield this.nodemailerService.send(userEmailEntity.emailConfirmation.confirmationCode, userInputData.email);
            if (mailSendResponse) {
                const userId = yield this.usersRepositories.createUser(userEmailEntity);
                return !!userId;
            }
            return false;
        });
    }
    registrationConfirm(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authRepositories.getConfirmCode(code);
        });
    }
    registrationEmailResending(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authRepositories.registrationEmailResending(email);
        });
    }
    recoveryCodeEmailSend(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.authRepositories.recoveryCodeEmailSend(email);
        });
    }
    createNewPassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield this.jwtService.generateSalt(10);
            const passwordHash = yield this.jwtService.generateHash(newPassword.newPassword, passwordSalt);
            let getUserEmail;
            try {
                getUserEmail = yield this.authRepositories.getRecoveryCode(newPassword);
            }
            catch (e) {
                return false;
            }
            if (getUserEmail) {
                yield this.usersRepositories.updateUser(getUserEmail, passwordSalt, passwordHash);
                return true;
            }
            return false;
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map