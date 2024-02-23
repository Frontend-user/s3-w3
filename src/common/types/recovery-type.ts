import {ObjectId} from "mongodb";

export type RecoveryCodeType = {
    email: string
    recoveryCode: string
    userId:  {type: ObjectId, required: true}
}