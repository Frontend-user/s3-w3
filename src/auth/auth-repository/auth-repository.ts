import {TokenModel, UserModel, RecoveryCodeModel} from "../../db";
import {AuthType} from "../auth-types/auth-types";
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {NodemailerService} from "../../application/nodemailer-service";
import {RecoveryCodeType} from "../../common/types/recovery-type";

export class AuthRepositories {
    constructor(protected nodemailerService: NodemailerService) {

    }

    async authUser(auth: AuthType): Promise<boolean> {
        const response = await UserModel.find({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]}).lean()
        return !!response
    }

    async getUserHash(auth: AuthType) {
        const response = await UserModel.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]}).lean()
        return response ? response : false
    }

    async getUserIdByAutData(auth: AuthType) {
        const response = await UserModel.findOne({$or: [{'accountData.login': auth.loginOrEmail}, {'accountData.email': auth.loginOrEmail}]}).lean()
        return response ? response : false
    }

    async getConfirmCode(code: string): Promise<boolean> {
        const getUser = await UserModel.findOne({'emailConfirmation.confirmationCode': code}).lean()
        if (getUser) {
            const respUpdate = await UserModel.updateOne({_id: getUser._id},
                {isConfirmed: true}
            )
            return respUpdate.modifiedCount === 1
        }
        return false
    }

    async addUnValidRefreshToken(refreshToken: string) {
        let resp = await TokenModel.create({refreshToken})
        return resp
    }

    async getUnValidRefreshTokens() {
        const tokens = await TokenModel.find({}).lean()
        return tokens
    }

    async getRecoveryCode(newPassword: any):Promise<RecoveryCodeType | false> {
        let recoveryCode = await RecoveryCodeModel.findOne({recoveryCode: newPassword.recoveryCode}).lean()
        return recoveryCode ? recoveryCode : false
    }

    async recoveryCodeEmailSend(email: string) {
        const getUser = await UserModel.findOne({'accountData.email': email}).lean()
        let id: ObjectId | null = getUser ? getUser._id : null
        if (id) {
            const recoveryCode = uuidv4()
            await RecoveryCodeModel.create(
                {
                    email,
                    recoveryCode,
                    userId: id
                }
            )
            await this.nodemailerService.sendRecoveryCode(recoveryCode, email)
            return true
        }
        return false
    }

    async registrationEmailResending(email: string) {
        const getUser = await UserModel.findOne({'accountData.email': email}).lean()
        if (getUser) {
            const newCode = uuidv4()
            const respUpdate = await UserModel.updateOne({_id: getUser._id},
                {'emailConfirmation.confirmationCode': newCode}
            )
            if (respUpdate.matchedCount === 1) {
                await this.nodemailerService.send(newCode, email)
                return true
            } else {
                return false
            }

        }
        return false
    }

}