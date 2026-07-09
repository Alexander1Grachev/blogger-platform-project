import { LikeStatus } from "../../../core/consts/like-statuses";
import { NewestLike } from "../../../likes/domain/like-info";
import { PostDocument } from "../../domain/post.entity";

export type PostMapperData = {
  post: PostDocument;
  myStatus: LikeStatus;
  newestLikes: NewestLike[];
}


