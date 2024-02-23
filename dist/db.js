"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.RecoveryCodeModel = exports.PostModel = exports.BlogModel = exports.TokenModel = exports.UserModel = exports.devicesCollection = exports.tokensCollection = exports.commentsCollection = exports.usersCollection = exports.postsCollection = exports.blogsCollection = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const url = process.env.MONGO_URL;
if (!url) {
    throw new Error('! Url doesn\'t found');
}
console.log('url', url);
exports.client = new mongodb_1.MongoClient(url);
exports.blogsCollection = exports.client.db('db').collection('blogs');
exports.postsCollection = exports.client.db('db').collection('posts');
exports.usersCollection = exports.client.db('db').collection('users');
exports.commentsCollection = exports.client.db('db').collection('comments');
exports.tokensCollection = exports.client.db('db').collection('tokens');
exports.devicesCollection = exports.client.db('db').collection('devices');
const tokenSchema = new mongoose_1.default.Schema({
    refreshToken: { type: String, required: true }
});
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    blogId: { type: String || mongodb_1.ObjectId, required: true }
});
const blogSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
});
const recoveryCodeSchema = new mongoose_1.default.Schema({
    userId: { type: mongodb_1.ObjectId, required: true },
    recoveryCode: { type: String, required: true },
    email: { type: String, required: true },
});
const userSchema = new mongoose_1.default.Schema({
    accountData: {
        login: { type: String, required: true },
        email: { type: String, required: true },
        createdAt: { type: String, required: true },
    },
    passwordSalt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    emailConfirmation: {
        confirmationCode: { type: String, required: true },
        expirationDate: { type: String, required: true } || { type: Date, required: true }
    },
    isConfirmed: { type: Boolean, required: true },
    isCreatedFromAdmin: { type: Boolean, required: true }
});
exports.UserModel = mongoose_1.default.model('users', userSchema);
exports.TokenModel = mongoose_1.default.model('tokens', tokenSchema);
exports.BlogModel = mongoose_1.default.model('blogs', blogSchema);
exports.PostModel = mongoose_1.default.model('posts', postSchema);
exports.RecoveryCodeModel = mongoose_1.default.model('recovery-code', recoveryCodeSchema);
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.client.connect();
        yield exports.client.db('blogs').command({ ping: 1 });
        console.log('Connect successfully to mongo server');
        yield mongoose_1.default.connect(url)
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    }
    catch (e) {
        console.log('DONT connect successfully to mongo server');
        yield mongoose_1.default.disconnect();
        yield exports.client.close();
    }
});
exports.runDb = runDb;
//# sourceMappingURL=db.js.map