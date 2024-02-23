"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsController = exports.blogsService = exports.blogsQueryRepository = exports.blogsRepositories = void 0;
const blogs_repositories_1 = require("../repository/blogs-repositories");
const blogs_service_1 = require("../domain/blogs-service");
const blogs_controller_1 = require("../router/blogs-controller");
const blogs_query_repository_1 = require("../blogs-query/blogs-query-repository");
exports.blogsRepositories = new blogs_repositories_1.BlogsRepositories();
exports.blogsQueryRepository = new blogs_query_repository_1.BlogsQueryRepository();
exports.blogsService = new blogs_service_1.BlogsService(exports.blogsRepositories);
exports.blogsController = new blogs_controller_1.BlogsControllerConstructor(exports.blogsService, exports.blogsQueryRepository);
//# sourceMappingURL=composition-root.js.map