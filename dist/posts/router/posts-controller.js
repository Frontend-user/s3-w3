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
exports.PostsController = void 0;
const query_data_1 = require("../../common/custom-methods/query-data");
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
class PostsController {
    constructor(postsQueryRepository, postsService, blogsQueryRepository, commentsService, commentQueryRepository) {
        this.postsQueryRepository = postsQueryRepository;
        this.postsService = postsService;
        this.blogsQueryRepository = blogsQueryRepository;
        this.commentsService = commentsService;
        this.commentQueryRepository = commentQueryRepository;
    }
    createCommentByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentContent = req.body.content;
            const postId = req.params.postId;
            const commentId = yield this.commentsService.createComment(commentContent, postId);
            if (!commentId) {
                res.sendStatus(404);
            }
            else {
                const comment = yield this.commentQueryRepository.getCommentById(commentId);
                delete comment.postId;
                res.status(201).send(comment);
            }
        });
    }
    getCommentByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
            const postId = req.params.postId;
            try {
                const comment = yield this.commentQueryRepository.getCommentsByPostId(postId, sortBy, sortDirection, pageNumber, pageSize, req.headers.authorization);
                res.status(200).send(comment);
            }
            catch (e) {
                res.send(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { sortBy, sortDirection, pageNumber, pageSize } = (0, query_data_1.getQueryData)(req);
                const posts = yield this.postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize);
                res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(posts);
            }
            catch (error) {
                console.error('Ошибка при получении данных из коллекции:', error);
                res.status(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postsQueryRepository.getPostById(req.params.id);
                if (!post) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
                    return;
                }
                res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(post);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let getBlogName;
            const getBlog = yield this.blogsQueryRepository.getBlogById(req.body.blogId);
            if (getBlog) {
                getBlogName = getBlog.name;
                let newPost = {
                    title: req.body.title,
                    shortDescription: req.body.shortDescription,
                    content: req.body.content,
                    blogId: req.body.blogId,
                    blogName: getBlogName,
                    createdAt: new Date().toISOString()
                };
                try {
                    const response = yield this.postsService.createPost(newPost);
                    if (response) {
                        const createdPost = yield this.postsQueryRepository.getPostById(response);
                        res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdPost);
                        return;
                    }
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
                    return;
                }
                catch (error) {
                    res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
                }
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let postDataToUpdate = {
                title: req.body.title,
                shortDescription: req.body.shortDescription,
                content: req.body.content,
                blogId: req.body.blogId
            };
            try {
                const response = yield this.postsService.updatePost(new mongodb_1.ObjectId(req.params.id), postDataToUpdate);
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.postsService.deletePost(new mongodb_1.ObjectId(req.params.id));
                res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
            catch (error) {
                res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            }
        });
    }
}
exports.PostsController = PostsController;
//# sourceMappingURL=posts-controller.js.map