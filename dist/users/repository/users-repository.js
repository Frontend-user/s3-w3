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
exports.UsersRepositories = void 0;
const db_1 = require("../../db");
class UsersRepositories {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.UserModel.create(user);
            return response ? response._id : false;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.UserModel.deleteOne({ _id: id });
            return !!response.deletedCount;
        });
    }
    updateUser(getUserEmail, passwordSalt, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            let updateUser = yield db_1.UserModel.updateOne({ _id: getUserEmail.userId }, { passwordSalt, passwordHash });
            return updateUser.matchedCount === 1;
        });
    }
}
exports.UsersRepositories = UsersRepositories;
//# sourceMappingURL=users-repository.js.map