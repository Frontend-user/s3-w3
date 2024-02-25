import {DeviceModel} from "../../db";
import {JwtService} from "../../application/jwt-service";

export class SecurityRepositories {
    constructor(protected jwtService:JwtService){}
    async createDevice(device: any) {
        const response = await DeviceModel.create(device)
        return response ? response._id : false
    }
    async deleteDevices(refreshToken: string) {
        let token = await this.jwtService.getRefreshToken(refreshToken)
        let deviceId = token.deviceId
        let userId = token.userId

        const response = await DeviceModel.deleteMany({$and: [{deviceId: {$ne: deviceId}}, {userId: userId}]})
        return !!response.deletedCount
    }
    async updateDevice(refreshToken: string) {
        let token = await this.jwtService.getRefreshToken(refreshToken)
        console.log(token, 'token')
        let deviceId = token.deviceId
        const response = await DeviceModel.updateOne({deviceId: deviceId}, {'lastActiveDate':  new Date(token.iat).toISOString()})
        return !!response
    }
    async deleteDeviceById(deviceId: string) {
        const response = await DeviceModel.deleteOne({deviceId: deviceId})
        return !!response.deletedCount
    }
}