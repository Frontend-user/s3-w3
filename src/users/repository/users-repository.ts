import {UserEmailEntityType} from "../types/user-types";
import {UserModel} from "../../db";
import {ObjectId} from "mongodb";
import {RecoveryCodeType} from "../../common/types/recovery-type";

export class UsersRepositories {

    async createUser(user: UserEmailEntityType): Promise<false | ObjectId> {
        const response = await UserModel.create(user)
        return response ? response._id : false
    }

    async deleteUser(id: ObjectId) {
        const response = await UserModel.deleteOne({_id: id})
        return !!response.deletedCount
    }

    async updateUser(getUserEmail: RecoveryCodeType, passwordSalt: string, passwordHash: string) {
        let updateUser = await UserModel.updateOne({_id: getUserEmail.userId}, {passwordSalt, passwordHash})
        return updateUser.matchedCount === 1
    }
}