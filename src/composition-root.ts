import "reflect-metadata";
import { Container } from "inversify";

import { BcryptService } from "./auth/adapters/bcrypt.service";
import { JwtService } from "./auth/adapters/jwt.service";

import { MeController } from "./auth/routers/handler/me.handler";
import { LoginController } from "./auth/routers/handler/login.handler";
import { LogoutController } from "./auth/routers/handler/logout-token.handler ";
import { RefreshTokenController } from "./auth/routers/handler/refresh-token.handler";
import { RegistrationController } from "./auth/routers/handler/registration.handler";
import { RegistrationEmailResendingController } from "./auth/routers/handler/registration-email-resending.handler";
import { RegistrationConfirmationController } from "./auth/routers/handler/registration-confirmation.handler";
import { PasswordRecoveryController } from "./auth/routers/handler/password-recovery.handler";
import { NewPasswordController } from "./auth/routers/handler/new-password.handler";

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
import { PostsQueryRepository } from "./posts/reposytories/posts.query.repository";

import { BlogsQueryRepository } from "./blogs/repositories/blogs.query.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { CommentsQueryRepository } from "./comments/repositories/comments.query.repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { SessionService } from "./security-devices/application/session.service";
import { SessionQueryRepository } from "./security-devices/repositories/session..query.repository";
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
import { NodemailerService } from "./auth/adapters/nodemailer.service";
import { LikesService } from "./likes/application/likes.service";
import { LikesRepository } from "./likes/repositories/likes.repository";
import { UpdateCommentLikeStatusController } from "./comments/routers/handlers/update-comment-like-status.handler";
import { LikesQueryRepository } from "./likes/repositories/likes.query.repository";

export const container = new Container({ defaultScope: 'Singleton' });

container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(SessionRepository).to(SessionRepository);
container.bind(SessionQueryRepository).to(SessionQueryRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(RateLimitRepository).to(RateLimitRepository);
container.bind(LikesRepository).to(LikesRepository);
container.bind(LikesQueryRepository).to(LikesQueryRepository);



container.bind(NodemailerService).to(NodemailerService);
container.bind(BcryptService).to(BcryptService);
container.bind(JwtService).to(JwtService);
container.bind(RateLimitService).to(RateLimitService);
container.bind(UsersService).to(UsersService);
container.bind(EmailService).to(EmailService);
container.bind(SessionService).to(SessionService);
container.bind(AuthService).to(AuthService);
container.bind(PostsService).to(PostsService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentsService).to(CommentsService);
container.bind(LikesService).to(LikesService);



container.bind(MeController).to(MeController);
container.bind(LoginController).to(LoginController);
container.bind(LogoutController).to(LogoutController);
container.bind(RefreshTokenController).to(RefreshTokenController);
container.bind(RegistrationController).to(RegistrationController);
container.bind(RegistrationEmailResendingController).to(RegistrationEmailResendingController);
container.bind(RegistrationConfirmationController).to(RegistrationConfirmationController);
container.bind(CreateUserController).to(CreateUserController);
container.bind(GetUserListController).to(GetUserListController);
container.bind(DeleteUseController).to(DeleteUseController);
container.bind(DeleteDeviceSessionsController).to(DeleteDeviceSessionsController);
container.bind(GetAllUserSessionsController).to(GetAllUserSessionsController);
container.bind(DeleteOtherUserSessionsController).to(DeleteOtherUserSessionsController);
container.bind(DeleteCommentController).to(DeleteCommentController);
container.bind(UpdateCommentController).to(UpdateCommentController);
container.bind(GetCommentController).to(GetCommentController);
container.bind(CreateBlogController).to(CreateBlogController);
container.bind(CreatePostForBlogController).to(CreatePostForBlogController);
container.bind(DeleteBlogController).to(DeleteBlogController);
container.bind(GetBlogListController).to(GetBlogListController);
container.bind(GetBlogController).to(GetBlogController);
container.bind(GetPostsByBlogController).to(GetPostsByBlogController);
container.bind(UpdateBlogController).to(UpdateBlogController);
container.bind(CreateCommentController).to(CreateCommentController);
container.bind(CreatePostController).to(CreatePostController);
container.bind(DeletePostController).to(DeletePostController);
container.bind(GetPostCommentsController).to(GetPostCommentsController);
container.bind(GetPostListController).to(GetPostListController);
container.bind(GetPostController).to(GetPostController);
container.bind(UpdatePostHController).to(UpdatePostHController);
container.bind(PasswordRecoveryController).to(PasswordRecoveryController);
container.bind(NewPasswordController).to(NewPasswordController);
container.bind(UpdateCommentLikeStatusController).to(UpdateCommentLikeStatusController);