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
exports.QuerySecurityRepositories = void 0;
const change_id_format_1 = require("../../common/custom-methods/change-id-format");
const db_1 = require("../../db");
class QuerySecurityRepositories {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    getAllDevices(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield this.jwtService.getRefreshToken(refreshToken);
            const response = yield db_1.DeviceModel.find({ userId: tokenData.userId }).lean();
            const devices = response.map((i => (0, change_id_format_1.deleteMongoUserId)(i)));
            return devices ? devices : [];
        });
    }
    getDeviceByDeviceId(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.DeviceModel.findOne({ deviceId: deviceId }).lean();
            return response ? response : false;
        });
    }
    getDeviceByDateAndDeviceId(oldTokenData) {
        return __awaiter(this, void 0, void 0, function* () {
            let device = yield db_1.DeviceModel.findOne({ $and: [{ deviceId: oldTokenData.deviceId }, { lastActiveDate: new Date(oldTokenData.iat).toISOString() }] }).lean();
            return device;
        });
    }
}
exports.QuerySecurityRepositories = QuerySecurityRepositories;
//# sourceMappingURL=query-security-repository.js.map