import mongoose, { HydratedDocument, model, Model } from 'mongoose'
import { PostInputDto } from '../application/dtos/post-input-dto';
import { BlogPostInputDto } from '../../blogs/application/dtos/blog-post-input-dto';

type CreatePostData = {
  title: string;
  shortDescription: string;
  content: string;
};

export class PostEntity {

  createdAt!: Date;
  updatedAt!: Date;

  private constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
  ) { };

  static createPost(
    dto: CreatePostData,
    blogId: string,
    blogName: string
  ): PostDocument {
    return new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blogName,
    }) as PostDocument;

  }
  updatePost(
    dto: PostInputDto
  ): void {
    this.title = dto.title
    this.shortDescription = dto.shortDescription
    this.content = dto.content
    this.blogId = dto.blogId
  }

};


interface PostMethods {
  updatePost(dto: PostInputDto): void;
}

interface PostStatics {
  createPost(
    dto: CreatePostData,
    blogId: string,
    blogName: string
  ): PostDocument;
}

type PostModel = Model<PostEntity, {}, PostMethods> & PostStatics;
export type PostDocument = HydratedDocument<PostEntity, PostMethods>;

const PostSchema = new mongoose.Schema<PostEntity, PostModel>({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
}, {
  timestamps: true
})
PostSchema.loadClass(PostEntity);


export const PostModel: PostModel = mongoose.model<PostEntity, PostModel>('Post', PostSchema)