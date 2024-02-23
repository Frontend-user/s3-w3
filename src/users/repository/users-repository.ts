import {UserEmailEntityType} from "../types/user-types";
import {UserModel} from "../../db";
import {ObjectId} from "mongodb";

export const usersRepositories = {

    async createUser(user: UserEmailEntityType): Promise<false | ObjectId> {
        const response = await UserModel.create(user)
        return response ? response._id : false
    },
    async deleteUser(id: ObjectId) {
        const response = await UserModel.deleteOne({_id: id})
        return !!response.deletedCount
    }
}