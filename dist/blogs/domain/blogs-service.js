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
exports.BlogsService = void 0;
const blogs_classes_1 = require("../blogs-classes");
class BlogsService {
    constructor(blogsRepositories) {
        this.blogsRepositories = blogsRepositories;
    }
    createBlog(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            let newBlog = new blogs_classes_1.BlogClass(blog.name, blog.description, blog.websiteUrl);
            const newBlogId = yield this.blogsRepositories.createBlog(newBlog);
            return newBlogId ? newBlogId : false;
        });
    }
    updateBlog(id, updateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepositories.updateBlog(id, updateBlog);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blogsRepositories.deleteBlog(id);
        });
    }
}
exports.BlogsService = BlogsService;
//# sourceMappingURL=blogs-service.js.map