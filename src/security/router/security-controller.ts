import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {SecurityRepositories} from "../repositories/security-repository";
import {JwtService} from "../../application/jwt-service";
import {QuerySecurityRepositories} from "../query-repository/query-security-repository";

export class SecurityDevicesController {
    constructor(
        protected securityRepositories:SecurityRepositories,
        protected querySecurityRepositories:QuerySecurityRepositories,
        protected jwtService:JwtService,

    ){}

    async getDevices(req: Request, res: Response)  {
        const devices = await this.querySecurityRepositories.getAllDevices(req.cookies.refreshToken)
        if (devices.length > 0) {
            res.send(devices)
        } else {
            res.sendStatus(401)
        }
    }
    async deleteDevices(req: Request, res: Response)  {

        await this.securityRepositories.deleteDevices(req.cookies.refreshToken)
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

    }
    async getDeviceById(req: Request, res: Response)  {
        if (!req.params.deviceId) {
            res.sendStatus(404)
            return
        }
        let userId = await this.jwtService.checkRefreshToken(req.cookies.refreshToken)
        let session = await this.querySecurityRepositories.getDeviceByDeviceId(req.params.deviceId)
        if (session) {
            if (session.userId !== userId) {
                res.sendStatus(403)
                return
            }
        }
        const resp = await this.securityRepositories.deleteDeviceById(req.params.deviceId)
        if (!resp) {
            res.sendStatus(404)
            return
        }

        res.sendStatus(204)


    }

}