import {AuthType} from "../auth-types/auth-types";
import {authRepositories} from "../auth-repository/auth-repository";
import {UserEmailEntityType, UserInputModelType} from "../../users/types/user-types";
import {jwtService} from "../../application/jwt-service";
import {v4 as uuidv4} from 'uuid'
import {nodemailerService} from "../../application/nodemailer-service";
import {add} from 'date-fns/add';
import {usersRepositories} from "../../users/repository/users-repository";
import {usersService} from "../../users/domain/users-service";
import {usersQueryRepository} from "../../users/query-repository/users-query-repository";
import {RecoveryCodeModel, UserModel} from "../../db";
import {ObjectId} from "mongodb";

const bcrypt = require('bcrypt');
export const authService = {
    async authUser(authData: AuthType): Promise<boolean> {
        const isExistLogin = await authRepositories.authUser(authData)
        const res = await authRepositories.getUserHash(authData)
        if (res && isExistLogin) {
            const passwordSalt = res.passwordSalt
            const passwordHash = res.passwordHash
            const newPasswordHash = await bcrypt.hash(authData.password, passwordSalt)
            return newPasswordHash === passwordHash;
        } else {
            return false
        }
    },
    async registration(userInputData: UserInputModelType) {
        const passwordSalt = await jwtService.generateSalt(10)
        const passwordHash = await jwtService.generateHash(userInputData.password, passwordSalt)

        const userEmailEntity: UserEmailEntityType = {
            accountData: {
                login: userInputData.login,
                email: userInputData.email,
                createdAt: new Date().toISOString(),
            },
            passwordSalt,
            passwordHash,
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 3})
            },
            isConfirmed: false,
            isCreatedFromAdmin: false
        }

        const mailSendResponse = await nodemailerService.send(userEmailEntity.emailConfirmation.confirmationCode, userInputData.email)
        if (mailSendResponse) {
            const userId = await usersRepositories.createUser(userEmailEntity)
            return !!userId
        }
        return false

    },

    async registrationConfirm(code: string) {
        return await authRepositories.getConfirmCode(code)
    },
    async registrationEmailResending(email: string) {
        return await authRepositories.registrationEmailResending(email)
    },
    async recoveryCodeEmailSend(email: string) {
        return await authRepositories.recoveryCodeEmailSend(email)
    },
    async createNewPassword(newPassword: any) {
        const passwordSalt = await jwtService.generateSalt(10)
        const passwordHash = await jwtService.generateHash(newPassword.newPassword, passwordSalt)
        let getUserEmail
        try {
            getUserEmail = await RecoveryCodeModel.findOne({recoveryCode: newPassword.recoveryCode}).lean()
        } catch (e) {
            return false
        }
        if (getUserEmail) {
            await UserModel.updateOne({_id: getUserEmail.userId}, {passwordSalt, passwordHash})
            return true
        }
        return false
    }
}