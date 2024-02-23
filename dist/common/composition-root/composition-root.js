"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = exports.postsController = exports.postsService = exports.postsRepositories = exports.blogsService = exports.blogsQueryRepository = exports.blogsRepositories = exports.postsQueryRepository = void 0;
const blogs_repositories_1 = require("../../blogs/repository/blogs-repositories");
const blogs_service_1 = require("../../blogs/domain/blogs-service");
const blogs_controller_1 = require("../../blogs/router/blogs-controller");
const blogs_query_repository_1 = require("../../blogs/blogs-query/blogs-query-repository");
const posts_repositories_1 = require("../../posts/repositories/posts-repositories");
const posts_query_repository_1 = require("../../posts/posts-query/posts-query-repository");
const posts_service_1 = require("../../posts/domain/posts-service");
const posts_controller_1 = require("../../posts/router/posts-controller");
//blogs
exports.postsQueryRepository = new posts_query_repository_1.PostsQueryRepository();
exports.blogsRepositories = new blogs_repositories_1.BlogsRepositories();
exports.blogsQueryRepository = new blogs_query_repository_1.BlogsQueryRepository();
exports.blogsService = new blogs_service_1.BlogsService(exports.blogsRepositories);
exports.postsRepositories = new posts_repositories_1.PostsRepositories();
exports.postsService = new posts_service_1.PostsService(exports.postsRepositories);
exports.postsController = new posts_controller_1.PostsController(exports.postsQueryRepository, exports.postsService);
exports.blogsController = new blogs_controller_1.BlogsControllerConstructor(exports.blogsService, exports.blogsQueryRepository, exports.postsQueryRepository, exports.postsService);
//# sourceMappingURL=composition-root.js.map