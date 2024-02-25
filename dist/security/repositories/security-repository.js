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
exports.SecurityRepositories = void 0;
const db_1 = require("../../db");
class SecurityRepositories {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    createDevice(device) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.DeviceModel.create(device);
            return response ? response._id : false;
        });
    }
    deleteDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.jwtService.getRefreshToken(refreshToken);
            let deviceId = token.deviceId;
            let userId = token.userId;
            const response = yield db_1.DeviceModel.deleteMany({ $and: [{ deviceId: { $ne: deviceId } }, { userId: userId }] });
            return !!response.deletedCount;
        });
    }
    updateDevice(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let token = yield this.jwtService.getRefreshToken(refreshToken);
            console.log(token, 'token');
            let deviceId = token.deviceId;
            const response = yield db_1.DeviceModel.updateOne({ deviceId: deviceId }, { 'lastActiveDate': new Date(token.iat).toISOString() });
            return !!response;
        });
    }
    deleteDeviceById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.DeviceModel.deleteOne({ deviceId: deviceId });
            return !!response.deletedCount;
        });
    }
}
exports.SecurityRepositories = SecurityRepositories;
//# sourceMappingURL=security-repository.js.map