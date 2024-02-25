import {deleteMongoUserId} from "../../common/custom-methods/change-id-format";
import {DeviceModel} from "../../db";
import {JwtService} from "../../application/jwt-service";

export class QuerySecurityRepositories  {
    constructor(protected jwtService:JwtService){}
    async getAllDevices(refreshToken: string) {
        const tokenData = await this.jwtService.getRefreshToken(refreshToken)
        const response = await DeviceModel.find({userId: tokenData.userId}).lean()
        const devices = response.map((i => deleteMongoUserId(i)))
        return devices ? devices : []
    }
    async getDeviceByDeviceId(deviceId: string) {
        const response = await DeviceModel.findOne({deviceId: deviceId}).lean()
        return response ? response : false
    }
    async getDeviceByDateAndDeviceId(oldTokenData: any) {
        let device = await DeviceModel.findOne({$and: [{deviceId: oldTokenData.deviceId}, {lastActiveDate: new Date(oldTokenData.iat).toISOString()}]}).lean()
        return device
    }

}