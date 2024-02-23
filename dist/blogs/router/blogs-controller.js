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
exports.BlogsControllerConstructor = exports.blogs = void 0;
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
const blogs_query_repository_1 = require("../blogs-query/blogs-query-repository");
const query_data_1 = require("../../common/custom-methods/query-data");
exports.blogs = [];
class BlogsControllerConstructor {
    constructor(blogsService) {
        this.blogsService = blogsService;
    }
    getBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
                let searchNameTerm = req.query.searchNameTerm ? String(req.query.searchNameTerm) : undefined;
                const blogs = yield blogs_query_repository_1.blogsQueryRepository.getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize);
                res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blogs);
            }
            catch (error) {
                console.error('Ошибка при получении данных из коллекции:', error);
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(req.params.id);
            if (!blog) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
                return;
            }
            res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(blog);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBlog = {
                    name: req.body.name,
                    description: req.body.description,
                    websiteUrl: req.body.websiteUrl,
                };
                const response = yield this.blogsService.createBlog(newBlog);
                if (response) {
                    const createdBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(String(response));
                    res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdBlog);
                    return;
                }
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let blogDataToUpdate = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
            };
            try {
                const response = yield this.blogsService.updateBlog(new mongodb_1.ObjectId(req.params.id), blogDataToUpdate);
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.blogsService.deleteBlog(new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
}
exports.BlogsControllerConstructor = BlogsControllerConstructor;
//# sourceMappingURL=blogs-controller.js.map