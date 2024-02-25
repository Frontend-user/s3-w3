import {ObjectId} from "mongodb";
import {SecurityRepositories} from "../repositories/security-repository";

export class SecurityService  {
    constructor(protected securityRepositories:SecurityRepositories){}
    async createDevice(device: any): Promise<ObjectId | boolean> {
        return  await this.securityRepositories.createDevice(device)
    }
}