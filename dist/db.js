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
exports.runDb = exports.RecoveryCodeModel = exports.CommentModel = exports.PostModel = exports.BlogModel = exports.TokenModel = exports.DeviceModel = exports.UserModel = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("./schemas/schemas");
dotenv_1.default.config();
const url = process.env.MONGO_URL;
if (!url) {
    throw new Error('! Url doesn\'t found');
}
console.log('url', url);
exports.client = new mongodb_1.MongoClient(url);
exports.UserModel = mongoose_1.default.model('users', schemas_1.userSchema);
exports.DeviceModel = mongoose_1.default.model('devices', schemas_1.deviceSchema);
exports.TokenModel = mongoose_1.default.model('tokens', schemas_1.tokenSchema);
exports.BlogModel = mongoose_1.default.model('blogs', schemas_1.blogSchema);
exports.PostModel = mongoose_1.default.model('posts', schemas_1.postSchema);
exports.CommentModel = mongoose_1.default.model('comments', schemas_1.commentSchema);
exports.RecoveryCodeModel = mongoose_1.default.model('recovery-code', schemas_1.recoveryCodeSchema);
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