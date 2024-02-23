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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
class PostsService {
    constructor(postsRepositories) {
        this.postsRepositories = postsRepositories;
    }
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPostId = yield this.postsRepositories.createPost(post);
            return newPostId ? newPostId : false;
        });
    }
    updatePost(id, updatePost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepositories.updatePost(id, updatePost);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepositories.deletePost(id);
        });
    }
}
exports.PostsService = PostsService;
//# sourceMappingURL=posts-service.js.map