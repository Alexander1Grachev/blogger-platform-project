import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { CommentInputDto } from "../application/dtos/comment-input.dto";
import { likeInfoSchema, LikeInfoView } from "../../likes/domain/like-info";


export type CommentatorInfoView = {
  userId: string;
  userLogin: string;
};


export class CommentEntity {
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(
    public content: string,
    public commentatorInfo: CommentatorInfoView,
    public postId: string, // для фильтрации коментариев 
    public likesInfo: LikeInfoView,
  ) { }


  static createComment(postId: string, me: { userId: string, login: string }, dto: CommentInputDto): CommentDocument {
    return new CommentModel({
      content: dto.content,
      commentatorInfo: {
        userId: me.userId,
        userLogin: me.login
      },
      postId: postId,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
      }
    }) as CommentDocument;

  }

  updateComment(dto: CommentInputDto): void {
    this.content = dto.content;
  }

  updateLikeInfo(likesCount: number, dislikesCount: number): void {
    this.likesInfo.likesCount = likesCount;
    this.likesInfo.dislikesCount = dislikesCount;
  }
}

interface CommentMethods {
  updateComment(dto: CommentInputDto): void;
  updateLikeInfo(likesCount: number, dislikesCount: number): void;
}
interface CommentStatics {
  createComment(
    postId: string,
    me: { userId: string, login: string },
    dto: CommentInputDto
  ): CommentDocument;
}



export const commentatorInfoSchema = {
  userId: { type: String, required: true },
  userLogin: { type: String, required: true },
}

export type CommentDocument = HydratedDocument<CommentEntity, CommentMethods>;
type CommentModel = Model<CommentEntity, {}, CommentMethods> & CommentStatics;


export const CommentSchema = new mongoose.Schema<CommentEntity, CommentModel>({
  content: { type: String, required: true, trim: true },
  commentatorInfo: { type: commentatorInfoSchema },
  postId: { type: String, required: true },
  likesInfo: { type: likeInfoSchema },
}, {
  timestamps: true
})

CommentSchema.loadClass(CommentEntity);

export const CommentModel: CommentModel = mongoose.model<CommentEntity, CommentModel>('Comment', CommentSchema)