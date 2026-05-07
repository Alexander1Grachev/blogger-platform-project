import { BcryptService } from "./auth/adapters/bcrypt.service";
import { JwtService } from "./auth/adapters/jwt.service";
import { accessTokenGuard } from "./auth/middlewares/access.token.guard";
import { refreshTokenGuard } from "./auth/middlewares/refresh.token.guard";
import { rateLimit } from "./core/middlewares/rate-limit.middleware";

import { MeController } from "./auth/routers/handler/me.handler";
import { LoginController } from "./auth/routers/handler/login.handler";
import { LogoutController } from "./auth/routers/handler/logout-token.handler ";
import { RefreshTokenController } from "./auth/routers/handler/refresh-token.handler";
import { RegistrationController } from "./auth/routers/handler/registration.handler";
import { RegistrationEmailResendingController } from "./auth/routers/handler/registration-email-resending.handler";
import { RegistrationConfirmationController } from "./auth/routers/handler/registration-confirmation.handler";

import { CreateUserController } from "./users/routers/handlers/create-user.handler";
import { GetUserListController } from "./users/routers/handlers/get-user-list.handler";
import { DeleteUseController } from "./users/routers/handlers/delete-user.handler";


import { DeleteDeviceSessionsController } from "./security-devices/routers/handler/delete-device-sessions.handler";
import { GetAllUserSessionsController } from "./security-devices/routers/handler/get-all-user-sessions.handler";
import { DeleteOtherUserSessionsController } from "./security-devices/routers/handler/delete-other-user-sessions.handler";

import { DeleteCommentController } from "./comments/routers/handlers/delete-comment.handler";
import { UpdateCommentController } from "./comments/routers/handlers/update-comment.handler";
import { GetCommentController } from "./comments/routers/handlers/get-comment.handler";

import { CreateBlogController } from "./blogs/routers/handlers/create-blog.handler";
import { CreatePostForBlogController } from "./blogs/routers/handlers/create-post.blog.handler";
import { DeleteBlogController } from "./blogs/routers/handlers/delete-blog.handler";
import { GetBlogListController } from "./blogs/routers/handlers/get-blog-list.handler";
import { GetBlogController } from "./blogs/routers/handlers/get-blog.handler";
import { GetPostsByBlogController } from "./blogs/routers/handlers/get-posts-by-blog.handler";
import { UpdateBlogController } from "./blogs/routers/handlers/update-blog.handler";


import { CreatePostController } from "./posts/routers/handlers/create-post.handler";
import { DeletePostController } from "./posts/routers/handlers/delete-post.handler";
import { GetPostCommentsController } from "./posts/routers/handlers/get-post-comment-list.handler";
import { GetPostListController } from "./posts/routers/handlers/get-post-list.handler";
import { GetPostController } from "./posts/routers/handlers/get-post.handler";
import { UpdatePostHController } from "./posts/routers/handlers/update-post.handler";
import { CreateCommentController } from "./posts/routers/handlers/create-comment.handler";


import { PostsRepository } from "./posts/reposytories/posts.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { SessionService } from "./security-devices/application/session.service";
import { SessionRepository } from "./security-devices/repositories/session.repository";
import { UsersRepository } from "./users/repositories/users.repository";
import { UsersQueryRepository } from "./users/repositories/users.query.repository";
import { RateLimitRepository } from "./infrastructure/rate-limit/rate-limit.repository";


import { CommentsService } from "./comments/application/comments.service";
import { BlogsService } from "./blogs/application/blogs.service";
import { PostsService } from "./posts/application/posts.service";
import { AuthService } from "./auth/application/auth-user.service";
import { EmailService } from "./auth/application/auth-email.service ";
import { UsersService } from "./users/application/users.service";
import { RateLimitService } from "./infrastructure/rate-limit/rate-limit-service";


export const bcryptService = new BcryptService();
export const jwtService = new JwtService();

export const commentsRepository = new CommentsRepository();
export const sessionRepository = new SessionRepository();
export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const blogsRepository = new BlogsRepository();
export const postsRepository = new PostsRepository();
export const rateLimitRepository = new RateLimitRepository();


export const rateLimitService = new RateLimitService(rateLimitRepository);
export const usersService = new UsersService(bcryptService, usersQueryRepository, usersRepository);
export const emailService = new EmailService(usersQueryRepository, usersRepository);
export const sessionService = new SessionService(sessionRepository);
export const authService = new AuthService(
    bcryptService,
    jwtService,
    sessionService,
    sessionRepository,
    usersQueryRepository,
    usersRepository
);
export const postsService = new PostsService(blogsRepository, postsRepository);
export const blogsService = new BlogsService(blogsRepository);
export const commentsService = new CommentsService(authService, postsService, commentsRepository);

export const rateLimitMiddleware = rateLimit(rateLimitService);
export const accessTokenGuardMiddleware = accessTokenGuard(jwtService);
export const refreshTokenGuardMiddleware = refreshTokenGuard(jwtService, authService);
// auth
export const meController = new MeController(authService);
export const loginController = new LoginController(authService);
export const logoutController = new LogoutController(sessionService);
export const refreshTokenController = new RefreshTokenController(sessionService, jwtService);
export const registrationController = new RegistrationController(authService);
export const registrationEmailResendingController = new RegistrationEmailResendingController(emailService);
export const registrationConfirmationController = new RegistrationConfirmationController(emailService);
// users
export const createUserController = new CreateUserController(usersService);
export const getUserListController = new GetUserListController(usersService);
export const deleteUseController = new DeleteUseController(usersService);
// security-devices
export const deleteDeviceSessionsController = new DeleteDeviceSessionsController(sessionService);
export const getAllUserSessionsController = new GetAllUserSessionsController(sessionService);
export const deleteOtherUserSessionsController = new DeleteOtherUserSessionsController(sessionService);
// comments
export const deleteCommentController = new DeleteCommentController(commentsService);
export const updateCommentController = new UpdateCommentController(commentsService);
export const getCommentController = new GetCommentController(commentsService);
// blogs
export const createBlogController = new CreateBlogController(blogsService);
export const createPostForBlogController = new CreatePostForBlogController(postsService);
export const deleteBlogController = new DeleteBlogController(blogsService);
export const getBlogListController = new GetBlogListController(blogsService);
export const getBlogController = new GetBlogController(blogsService);
export const getPostsByBlogController = new GetPostsByBlogController(postsService);
export const updateBlogController = new UpdateBlogController(blogsService);
// posts
export const createCommentController = new CreateCommentController(commentsService);
export const createPostController = new CreatePostController(postsService);
export const deletePostController = new DeletePostController(postsService);
export const getPostCommentsController = new GetPostCommentsController(commentsService);
export const getPostListController = new GetPostListController(postsService);
export const getPostController = new GetPostController(postsService);
export const updatePostHController = new UpdatePostHController(postsService);
