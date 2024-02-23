"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsController = exports.blogsController = exports.postsController = exports.commentsService = exports.commentQueryRepository = exports.commentsRepository = exports.postsService = exports.postsRepositories = exports.blogsService = exports.blogsQueryRepository = exports.blogsRepositories = exports.postsQueryRepository = void 0;
const blogs_repositories_1 = require("../../blogs/repository/blogs-repositories");
const blogs_service_1 = require("../../blogs/domain/blogs-service");
const blogs_controller_1 = require("../../blogs/router/blogs-controller");
const blogs_query_repository_1 = require("../../blogs/blogs-query/blogs-query-repository");
const posts_repositories_1 = require("../../posts/repositories/posts-repositories");
const posts_query_repository_1 = require("../../posts/posts-query/posts-query-repository");
const posts_service_1 = require("../../posts/domain/posts-service");
const posts_controller_1 = require("../../posts/router/posts-controller");
const comments_repository_1 = require("../../comments/repository/comments-repository");
const comment_query_repository_1 = require("../../comments/query-repository/comment-query-repository");
const comments_service_1 = require("../../comments/service/comments-service");
const comments_controller_1 = require("../../comments/router/comments-controller");
exports.postsQueryRepository = new posts_query_repository_1.PostsQueryRepository();
exports.blogsRepositories = new blogs_repositories_1.BlogsRepositories();
exports.blogsQueryRepository = new blogs_query_repository_1.BlogsQueryRepository();
exports.blogsService = new blogs_service_1.BlogsService(exports.blogsRepositories);
exports.postsRepositories = new posts_repositories_1.PostsRepositories();
exports.postsService = new posts_service_1.PostsService(exports.postsRepositories);
exports.commentsRepository = new comments_repository_1.CommentsRepository();
exports.commentQueryRepository = new comment_query_repository_1.CommentQueryRepository();
exports.commentsService = new comments_service_1.CommentsService(exports.commentsRepository);
exports.postsController = new posts_controller_1.PostsController(exports.postsQueryRepository, exports.postsService, exports.blogsQueryRepository, exports.commentsService, exports.commentQueryRepository);
exports.blogsController = new blogs_controller_1.BlogsControllerConstructor(exports.blogsService, exports.blogsQueryRepository, exports.postsQueryRepository, exports.postsService);
exports.commentsController = new comments_controller_1.CommentsController(exports.commentsService, exports.commentQueryRepository);
//# sourceMappingURL=composition-root.js.map