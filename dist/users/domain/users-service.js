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
exports.UsersService = void 0;
class UsersService {
    constructor(jwtService, usersRepositories) {
        this.jwtService = jwtService;
        this.usersRepositories = usersRepositories;
    }
    createUser(user, isReqFromSuperAdmin) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield this.jwtService.generateSalt(10);
            const passwordHash = yield this.jwtService.generateHash(user.password, passwordSalt);
            const userEmailEntity = {
                accountData: {
                    login: user.login,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                },
                passwordSalt,
                passwordHash,
                emailConfirmation: {
                    confirmationCode: 'superadmin',
                    expirationDate: 'superadmin'
                },
                isConfirmed: isReqFromSuperAdmin,
                isCreatedFromAdmin: true
            };
            const userId = yield this.usersRepositories.createUser(userEmailEntity);
            if (!userId) {
                return false;
            }
            return userId;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepositories.deleteUser(id);
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users-service.js.map