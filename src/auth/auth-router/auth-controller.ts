import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {currentUser} from "../../application/current-user";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {AuthType} from "../auth-types/auth-types";
import {v4 as uuidv4} from "uuid";
import {AuthService} from "../auth-domain/auth-service";
import {UsersQueryRepository} from "../../users/query-repository/users-query-repository";
import {JwtService} from "../../application/jwt-service";
import {QuerySecurityRepositories} from "../../security/query-repository/query-security-repository";
import {SecurityRepositories} from "../../security/repositories/security-repository";
import {AuthRepositories} from "../auth-repository/auth-repository";
import {SecurityService} from "../../security/domain/security-service";

export class AuthController {
    constructor(protected authService:AuthService,
                protected usersQueryRepository:UsersQueryRepository,
                protected jwtService:JwtService,
                protected querySecurityRepositories:QuerySecurityRepositories,
                protected securityRepositories:SecurityRepositories,
                protected authRepositories:AuthRepositories,
                protected securityService:SecurityService,
                ) {
    }
    async me(req: Request, res: Response) {
        let token = req.headers.authorization!.split(' ')[1]
        let userId = await this.jwtService.checkToken(token)

        const getUserByID = await this.usersQueryRepository.getUserById(new ObjectId(userId))
        if (!getUserByID) {
            res.sendStatus(401)
            return
        }
        if (getUserByID) {

            currentUser.userLogin = getUserByID.login
            currentUser.userId = userId
            res.send({
                "email": getUserByID.email,
                "login": getUserByID.login,
                "userId": getUserByID.id
            })
            return

        } else {
            res.sendStatus(401)
            return

        }

    }
    async refreshToken(req: Request, res: Response) {
        const getRefreshToken = req.cookies.refreshToken
        const userId = await this.jwtService.checkRefreshToken(getRefreshToken)
        if (!userId) {
            res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
            return
        }

        const oldTokenData = await this.jwtService.getRefreshToken(getRefreshToken)
        const isError = await this.querySecurityRepositories.getDeviceByDateAndDeviceId(oldTokenData)

        if (!isError) {
            res.sendStatus(401)
            return
        }
        const tokenData = await this.jwtService.getRefreshToken(req.cookies.refreshToken)
        const refreshToken = await this.jwtService.createRefreshToken(userId, tokenData.deviceId)


        await this.securityRepositories.updateDevice(refreshToken)
        const token = await this.jwtService.createJWT(userId)
        await this.authRepositories.addUnValidRefreshToken(getRefreshToken)

        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
        res.send({accessToken: token})
    }
    async login(req: Request, res: Response) {
        try {
            const authData: AuthType = {
                loginOrEmail: req.body.loginOrEmail,
                password: req.body.password,
            }
            const response = await this.authService.authUser(authData)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
                return
            }
            const createdDeviceId = uuidv4()
            const user = await this.authRepositories.getUserIdByAutData(authData)
            if (user) {
                currentUser.userId = user._id
                currentUser.userLogin = user.accountData.login
                const token = await this.jwtService.createJWT(user._id)
                const refreshToken = await this.jwtService.createRefreshToken(user._id, createdDeviceId)
                const dataToken = await this.jwtService.getRefreshToken(refreshToken)
                await this.securityService.createDevice({
                        userId: String(user._id),
                        ip: req.ip,
                        title: req.headers['user-agent'] ?? 'string',
                        lastActiveDate: new Date(dataToken.iat).toISOString(),
                        deviceId: createdDeviceId
                    }
                )
                res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
                res.send({accessToken: token})


            }
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    }
    async registration(req: Request, res: Response) {
        try {

            const userInputData = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password,
            }
            const response = await this.authService.registration(userInputData)

            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }
            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }
    async registrationConfirmation(req: Request, res: Response)  {
        try {

            const response = await this.authService.registrationConfirm(req.body.code)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }
    async registrationEmailResending(req: Request, res: Response)  {
        try {

            const response = await this.authService.registrationEmailResending(req.body.email)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
                return
            }

            res.send(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    }
    async passwordRecovery (req: Request, res: Response){
        try {
            let resp = await this.authService.recoveryCodeEmailSend(req.body.email)
            res.sendStatus(204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
        }
    }

    async newPassword(req: Request, res: Response) {
        try {
            let newPassword = {
                newPassword: req.body.newPassword,
                recoveryCode: req.body.recoveryCode
            }
            let response = await this.authService.createNewPassword(newPassword)
            if (!response) {
                res.status(HTTP_STATUSES.SOMETHING_WRONG_400).send({ errorsMessages: [{ message: 'String', field: "recoveryCode" }] })
                return
            }
            res.sendStatus(204)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SOMETHING_WRONG_400)
        }
    }

}