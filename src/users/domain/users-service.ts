import {ObjectId} from "mongodb";
import { UserEmailEntityType,  UserInputModelType} from "../types/user-types";
import {JwtService} from "../../application/jwt-service";
import {UsersRepositories} from "../repository/users-repository";


export class UsersService {
    constructor(
        protected jwtService:JwtService,
        protected usersRepositories:UsersRepositories,
                ){}
    async createUser(user: UserInputModelType, isReqFromSuperAdmin: boolean): Promise<ObjectId | false> {
        const passwordSalt=  await this.jwtService.generateSalt(10)
        const passwordHash = await this.jwtService.generateHash(user.password, passwordSalt)
         const  userEmailEntity: UserEmailEntityType  = {
             accountData: {
                 login: user.login,
                 email: user.email,
                 createdAt: new Date().toISOString(),
             },
             passwordSalt,
             passwordHash,
             emailConfirmation: {
                 confirmationCode: 'superadmin',
                 expirationDate: 'superadmin'
             },
             isConfirmed: isReqFromSuperAdmin,
             isCreatedFromAdmin: true
         }
            const userId = await this.usersRepositories.createUser(userEmailEntity)
            if (!userId) {
                return false
            }
            return userId
    }
    async deleteUser(id: ObjectId): Promise<boolean> {
        return await this.usersRepositories.deleteUser(id)
    }



}