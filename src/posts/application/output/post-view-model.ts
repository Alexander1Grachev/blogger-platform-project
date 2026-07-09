import { LikeStatus } from "../../../core/consts/like-statuses";
import { NewestLike } from "../../../likes/domain/like-info";

export type PostViewModel = {
  id: string; // <-- Добавляем id только в ответ
  title: string;
  shortDescription: string;
  content: string;
  blogId: string; // <-- Добавляем id блога только в ответ
  blogName: string; // <-- Добавляем имя блога только в ответ
  createdAt: string; // <-- Меняем на строку
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: NewestLike[]
  };
};
