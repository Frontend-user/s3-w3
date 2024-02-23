import {MongoClient} from 'mongodb'
import { BlogEntityType} from "./common/types/blog-type";
import dotenv from 'dotenv'
import { PostEntityType} from "./common/types/post-type";
import { UserEmailEntityType} from "./users/types/user-types";
import mongoose from "mongoose";
import {blogSchema, commentSchema, deviceSchema, postSchema, recoveryCodeSchema, tokenSchema, userSchema} from "./schemas/schemas";
import {RecoveryCodeType} from "./common/types/recovery-type";
import {CommentCreateType} from "./comments/types/comment-type";


dotenv.config()
const url = process.env.MONGO_URL

if (!url) {
    throw new Error('! Url doesn\'t found')
}

console.log('url', url)

export const client = new MongoClient(url)


export const UserModel = mongoose.model<UserEmailEntityType>('users', userSchema);
export const DeviceModel = mongoose.model('devices', deviceSchema);
export const TokenModel = mongoose.model('tokens', tokenSchema);
export const BlogModel = mongoose.model<BlogEntityType>('blogs', blogSchema);
export const PostModel = mongoose.model<PostEntityType>('posts', postSchema);
export const CommentModel = mongoose.model<CommentCreateType>('comments', commentSchema);

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