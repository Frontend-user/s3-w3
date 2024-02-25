import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {currentUser} from "../application/current-user";
import {jwtService, usersQueryRepository} from "../common/composition-root/composition-root";

const AUTH_CODE = 'YWRtaW46cXdlcnR5'
export const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let requestAuthCode = req.headers.authorization

    if (!requestAuthCode || requestAuthCode.slice(6) !== AUTH_CODE) {
        res.sendStatus(401)
        return
    } else {
        next()
    }

}
export const bearerAndAdminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    let requestAuthCode = req.headers.authorization
    let token = req.headers.authorization!.split(' ')[1]

    const userId = await jwtService.checkToken(token)
    const getUserByID = await usersQueryRepository.getUserById(new ObjectId(userId))

    if (requestAuthCode && requestAuthCode.slice(6) === AUTH_CODE) {
        next()
        return
    } else if (!getUserByID || !userId) {

        res.sendStatus(401)
        return
    } else {
        currentUser.userId = userId
        currentUser.userLogin = getUserByID.login
        next()
    }
}

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {

        res.sendStatus(401)
        return
    }
    let token = req.headers.authorization!.split(' ')[1]

    const userId = await jwtService.checkToken(token)
    const getUserByID = await usersQueryRepository.getUserById(new ObjectId(userId))
    if (!getUserByID || !userId) {

        res.sendStatus(401)
        return
    } else {
        currentUser.userId = userId
        currentUser.userLogin = getUserByID.login
        next()
    }
}