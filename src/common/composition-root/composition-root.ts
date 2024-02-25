import {BlogsRepositories} from "../../blogs/repository/blogs-repositories";
import {BlogsService} from "../../blogs/domain/blogs-service";
import {BlogsControllerConstructor} from "../../blogs/router/blogs-controller";
import {BlogsQueryRepository} from "../../blogs/blogs-query/blogs-query-repository";
import {PostsRepositories} from "../../posts/repositories/posts-repositories";
import {PostsQueryRepository} from "../../posts/posts-query/posts-query-repository";
import {PostsService} from "../../posts/domain/posts-service";
import {PostsController} from "../../posts/router/posts-controller";
import {CommentsRepository} from "../../comments/repository/comments-repository";
import {CommentQueryRepository} from "../../comments/query-repository/comment-query-repository";
import {CommentsService} from "../../comments/service/comments-service";
import {CommentsController} from "../../comments/router/comments-controller";
import {AuthController} from "../../auth/auth-router/auth-controller";
import {AuthService} from "../../auth/auth-domain/auth-service";
import {UsersQueryRepository} from "../../users/query-repository/users-query-repository";
import {JwtService} from "../../application/jwt-service";
import {QuerySecurityRepositories} from "../../security/query-repository/query-security-repository";
import {SecurityRepositories} from "../../security/repositories/security-repository";
import {AuthRepositories} from "../../auth/auth-repository/auth-repository";
import {SecurityService} from "../../security/domain/security-service";
import {UsersRepositories} from "../../users/repository/users-repository";
import {NodemailerService} from "../../application/nodemailer-service";
import {UsersController} from "../../users/router/users-controller";
import {UsersService} from "../../users/domain/users-service";
import {SecurityDevicesController} from "../../security/router/security-controller";

export const postsQueryRepository = new PostsQueryRepository()
export const blogsRepositories = new BlogsRepositories()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogsService = new BlogsService(blogsRepositories)
export const postsRepositories = new PostsRepositories()
export const postsService = new PostsService(postsRepositories)
export const commentsRepository = new CommentsRepository()
export const usersQueryRepository = new UsersQueryRepository()
export const jwtService = new JwtService(usersQueryRepository)
export const commentQueryRepository = new CommentQueryRepository(jwtService)
export const commentsService = new CommentsService(commentsRepository)
export const postsController = new PostsController(postsQueryRepository, postsService, blogsQueryRepository,commentsService, commentQueryRepository)
export const blogsController = new BlogsControllerConstructor(blogsService, blogsQueryRepository, postsQueryRepository, postsService)
export const commentsController = new CommentsController(commentsService, commentQueryRepository)
// constructor(protected authService:AuthService){}
export const usersRepositories = new UsersRepositories()
export const querySecurityRepositories = new QuerySecurityRepositories(jwtService)
export const securityRepositories = new SecurityRepositories(jwtService)
export const nodemailerService = new NodemailerService()
export const authRepositories = new AuthRepositories(nodemailerService)
export const securityService = new SecurityService(securityRepositories)
export const authService = new AuthService(authRepositories,jwtService,usersRepositories, nodemailerService)

export const authController = new AuthController(authService, usersQueryRepository,
    jwtService,querySecurityRepositories, securityRepositories,authRepositories,
    securityService)

export const usersService = new UsersService(jwtService, usersRepositories)
export const usersController = new UsersController(usersService, usersQueryRepository,)
export const securityDevicesController =
    new SecurityDevicesController(securityRepositories, querySecurityRepositories,jwtService)