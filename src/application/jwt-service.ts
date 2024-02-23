import {currentUser} from "./current-user";

const bcrypt = require('bcrypt');
import {v4 as uuidv4} from "uuid";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../users/query-repository/users-query-repository";

const jwt = require('jsonwebtoken')
export const jwtService = {
    async createJWT(userId: any) {

        return await jwt.sign({userId: userId}, process.env.JWT_SECRET, {expiresIn: '10m'})
    },
    async createRefreshToken(userId: ObjectId | string, newDeviceId: string) {
        return await jwt.sign({
            userId: userId,
            deviceId: newDeviceId
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '10h'})

    },
    async checkRefreshToken(token: string) {
        try {
            const result: any = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            let isFindUser = await usersQueryRepository.getUserById(new ObjectId(result.userId))

            return isFindUser ? result.userId : false
        } catch (error) {
            return
        }
    },
    async getRefreshToken(token:string){
        try {
            const result: any = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

            return result ? result : false
        } catch (error) {
            return
        }
    },
    async checkToken(token: string) {
        try {
            const result: any = await jwt.verify(token, process.env.JWT_SECRET);
            let isFindUser = await usersQueryRepository.getUserById(new ObjectId(result.userId))
            return isFindUser ? result.userId : false
        } catch (error) {
            return
        }
    },


    async generateSalt(saltNumber: number) {
        return await bcrypt.genSalt(saltNumber)
    },

    async generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        if (hash) {
            return hash
        }
        return false
    },
}

