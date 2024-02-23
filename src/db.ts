import {MongoClient, ObjectId} from 'mongodb'
import {BlogCreateType, BlogEntityType} from "./common/types/blog-type";

import dotenv from 'dotenv'
import {PostCreateType, PostEntityType} from "./common/types/post-type";
import {UserCreateType, UserEmailEntityType, UserHashType} from "./users/types/user-types";
import mongoose from "mongoose";

dotenv.config()
const url = process.env.MONGO_URL

if (!url) {
    throw new Error('! Url doesn\'t found')
}

console.log('url', url)


export const client = new MongoClient(url)
export const blogsCollection = client.db('db').collection<BlogEntityType | BlogCreateType>('blogs')
export const postsCollection = client.db('db').collection<PostEntityType | PostCreateType>('posts')
export const usersCollection = client.db('db').collection<UserEmailEntityType>('users')
export const commentsCollection = client.db('db').collection('comments')
export const tokensCollection = client.db('db').collection('tokens')
export const devicesCollection = client.db('db').collection('devices')

const tokenSchema = new mongoose.Schema({
    refreshToken: {type: String, required: true}
})

const postSchema = new mongoose.Schema<PostEntityType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    blogId: {type: String || ObjectId, required: true}
})
const blogSchema = new mongoose.Schema<BlogEntityType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
})
const recoveryCodeSchema = new mongoose.Schema<RecoveryCodeType>({
    userId: {type: ObjectId, required: true},
    recoveryCode: {type: String, required: true},
    email: {type: String, required: true},
})
const userSchema = new mongoose.Schema<UserEmailEntityType>({
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        createdAt: {type: String, required: true},
    },
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    emailConfirmation: {
        confirmationCode: {type: String, required: true},
        expirationDate: {type: String, required: true} || {type: Date, required: true}
    },
    isConfirmed: {type: Boolean, required: true},
    isCreatedFromAdmin: {type: Boolean, required: true}
});
export const UserModel = mongoose.model<UserEmailEntityType>('users', userSchema);
export const TokenModel = mongoose.model('tokens', tokenSchema);
export const BlogModel = mongoose.model<BlogEntityType>('blogs', blogSchema);
export const PostModel = mongoose.model<PostEntityType>('posts', postSchema);
type RecoveryCodeType = {
    email: string
    recoveryCode: string
    userId:  {type: ObjectId, required: true}
}
export const RecoveryCodeModel = mongoose.model<RecoveryCodeType>('recovery-code', recoveryCodeSchema);
export const runDb = async () => {
    try {

        await client.connect();
        await client.db('blogs').command({ping: 1});
        console.log('Connect successfully to mongo server')
        await mongoose.connect(url)
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));

    } catch (e) {

        console.log('DONT connect successfully to mongo server')
        await mongoose.disconnect()
        await client.close()
    }
}