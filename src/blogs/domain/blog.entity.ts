
import mongoose, { HydratedDocument, model, Model } from 'mongoose'
import { BlogInputDto } from "../application/dtos/blog-input-dto";



export class BlogEntity {
  isMembership: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,

  ) {
    this.isMembership = false;
  }

  static createBlog(dto: BlogInputDto): BlogDocument {
    return new BlogModel({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
    }) as BlogDocument // создаём через модель

  }
  // отдельный метод для суперадмина
  setMembership(value: boolean): void {
    this.isMembership = value;
  }
  updateBlog(dto: BlogInputDto): void {
    this.name = dto.name;
    this.description = dto.description;
    this.websiteUrl = dto.websiteUrl;
  }
}
interface BlogMethods {
  updateBlog(dto: BlogInputDto): void;
}
interface BlogStatics {
  createBlog(dto: BlogInputDto): BlogDocument;
}


type BlogModel = Model<BlogEntity, {}, BlogMethods> & BlogStatics;
export type BlogDocument = HydratedDocument<BlogEntity, BlogMethods>;

const BlogSchema = new mongoose.Schema<BlogEntity, BlogModel>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
}, {
  timestamps: true
})

// подключает методы И статики класса к схеме разом
BlogSchema.loadClass(BlogEntity);

//  Создание модели
export const BlogModel: BlogModel = mongoose.model<BlogEntity, BlogModel>('Blog', BlogSchema)