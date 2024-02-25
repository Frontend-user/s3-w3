import {AuthType} from "../auth-types/auth-types";
import {UserEmailEntityType, UserInputModelType} from "../../users/types/user-types";
import {v4 as uuidv4} from 'uuid'
import {add} from 'date-fns/add';
import {AuthRepositories} from "../auth-repository/auth-repository";
import {JwtService} from "../../application/jwt-service";
import {UsersRepositories} from "../../users/repository/users-repository";
import {NodemailerService} from "../../application/nodemailer-service";

const bcrypt = require('bcrypt');

export class AuthService {
    constructor(protected authRepositories: AuthRepositories,
                protected jwtService: JwtService,
                protected usersRepositories: UsersRepositories,
                protected nodemailerService: NodemailerService,
    ) {

    }

    async authUser(authData: AuthType): Promise<boolean> {
        const isExistLogin = await this.authRepositories.authUser(authData)
        const res = await this.authRepositories.getUserHash(authData)
        if (res && isExistLogin) {
            const passwordSalt = res.passwordSalt
            const passwordHash = res.passwordHash
            const newPasswordHash = await bcrypt.hash(authData.password, passwordSalt)
            return newPasswordHash === passwordHash;
        } else {
            return false
        }
    }

    async registration(userInputData: UserInputModelType) {
        const passwordSalt = await this.jwtService.generateSalt(10)
        const passwordHash = await this.jwtService.generateHash(userInputData.password, passwordSalt)

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

        const mailSendResponse = await this.nodemailerService.send(userEmailEntity.emailConfirmation.confirmationCode, userInputData.email)
        if (mailSendResponse) {
            const userId = await this.usersRepositories.createUser(userEmailEntity)
            return !!userId
        }
        return false

    }

    async registrationConfirm(code: string) {
        return await this.authRepositories.getConfirmCode(code)
    }

    async registrationEmailResending(email: string) {
        return await this.authRepositories.registrationEmailResending(email)
    }

    async recoveryCodeEmailSend(email: string) {
        return await this.authRepositories.recoveryCodeEmailSend(email)
    }

    async createNewPassword(newPassword: any) {
        const passwordSalt = await this.jwtService.generateSalt(10)
        const passwordHash = await this.jwtService.generateHash(newPassword.newPassword, passwordSalt)
        let getUserEmail
        try {

            getUserEmail = await this.authRepositories.getRecoveryCode(newPassword)
        } catch (e) {
            return false
        }
        if (getUserEmail) {
            await this.usersRepositories.updateUser(getUserEmail, passwordSalt, passwordHash)
            return true
        }
        return false
    }
}