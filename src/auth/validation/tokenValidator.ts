import {body, cookie, header, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {ErrorType} from "../../common/types/error-type";
import {jwtService} from "../../application/jwt-service";
import {authRepositories} from "../auth-repository/auth-repository";
import * as dgram from "dgram";

export const authorizationTokenMiddleware = header('authorization').custom(async (value, {req}) => {
    if (!value) {
        throw new Error('Wrong authorization');

    }

    let token = value.split(' ')[1]
    if (!token) {
        throw new Error('Wrong authorization');
    }
    let userId
    try {
        userId = await jwtService.checkToken(token)
        if (!userId) {
            throw new Error('Wrong authorization');

        }
    } catch (e) {
        throw new Error('Wrong authorization');
    }
}).withMessage({
    message: 'authorization wrong',
    field: 'authorization'
})

export const isUnValidTokenMiddleware = cookie('refreshToken').custom(async (value, {req}) => {
    let unValidTokens = await authRepositories.getUnValidRefreshTokens()
    let find = unValidTokens.filter((item) => item.refreshToken === value)
    if (find.length > 0) {
        throw new Error('Wrong refreshToken');
    }
    return true
})
export const refreshTokenValidator = cookie('refreshToken').custom(async (value, {req}) => {
    const refreshToken = value
    const isExpired = await jwtService.checkRefreshToken(refreshToken)
    if (isExpired && refreshToken) {
        return true
    } else {
        throw new Error('Wrong refreshToken');
    }
}).withMessage({
    message: 'error refreshToken',
    field: 'refreshToken'
})

export const tokenValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError: true})
    if (errors.length) {
        let errorsForClient: ErrorType[] = []
        for (const error of errors) {
            errorsForClient.push(error.msg)
        }

        res.sendStatus(401)
        return
    } else {
        next()
    }
}
let dates: any[] = []
let loginDates: any[] = []
let emailDates: any[] = []
let confirmDates: any[] = []
export const authRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()
    if (dates.length >= 5 && (now - dates[0]) < 10000) {
        dates = []

        res.sendStatus(429)
        return
    } else {
        dates.push(now)
        next()
    }
}
let requests: any = []
export const loginRestrictionValidator = async (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()

    requests.push({
        ip:req.ip,
        time:now
    })
    if (loginDates.length >= 5 && (now - loginDates[0].time) < 10000) {
        loginDates = []

        res.sendStatus(429)
        return
    } else {
        if(loginDates.length >= 5){
            loginDates = []
        }
        loginDates.push({
            ip:req.ip,
            time:now
        })

        next()
    }
}

export const emailResendingRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()

    if (emailDates.length >= 5 && (now - emailDates[0]) < 10000) {
        emailDates = []

        res.sendStatus(429)
        return
    } else {
        if(emailDates.length >= 5){
            emailDates = []
        }
        emailDates.push(now)
        next()
    }
}

export const emailConfirmRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()

    if (confirmDates.length >= 5 && (now - confirmDates[0]) < 10000) {
        confirmDates = []

        res.sendStatus(429)
        return
    } else {
        confirmDates.push(now)
        next()
    }
}

let passwordRecoveryDates:any = []
export const passwordRecoveryRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()

    if (passwordRecoveryDates.length >=4 && (now - passwordRecoveryDates.slice(-5)[0]) < 10000) {
        // passwordRecoveryDates = []

        res.sendStatus(429)
        return
    } else {
        if(passwordRecoveryDates.length >= 5){
            // passwordRecoveryDates = []
        }
        passwordRecoveryDates.push(now)
        next()
    }
}
let newPasswordRecoveryDates: any = []



let requestArray:any = {}
export const customRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()
    let url = req.originalUrl + req.ip
    if(!requestArray[url]) {
        requestArray[url] = []
    }
    if (requestArray[url].length >=4 && (now - requestArray[url].slice(-5)[0]) < 10000) {
        res.sendStatus(429)
        return
    } else {
        requestArray[url].push(now)
        next()
    }
}


export const newPasswordRecoveryRestrictionValidator = (req: Request, res: Response, next: NextFunction) => {
    let now = Date.now()

    if (newPasswordRecoveryDates.length >= 5 && (now - newPasswordRecoveryDates[0]) < 10000) {
        newPasswordRecoveryDates = []

        res.sendStatus(429)
        return
    } else {
        if(newPasswordRecoveryDates.length >= 5){
            newPasswordRecoveryDates = []
        }
        newPasswordRecoveryDates.push(now)
        next()
    }
}

export const recoveryValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError:true})
    if (errors.length) {
        let errorsForClient:ErrorType[] = []
        for (const error of errors) {
            errorsForClient.push(error.msg)
            if(error.msg.message==='email not exist'){
                res.sendStatus(204)
                return;
            }
        }

        res.status(400).json({ errorsMessages: errorsForClient });
        return
    } else {
        next()
    }
}
export const newPasswordValidation = body('newPassword').trim().isString().isLength({min:6, max:20}).withMessage({
    message: 'newPassword is unvalid',
    field: 'newPassword'
})