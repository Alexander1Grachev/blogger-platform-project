import mongoose, { HydratedDocument, model, Model } from 'mongoose'





// 1. Интерфейс для TypeScript (без id, он будет автоматически)
export interface IBlog {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  updatedAt: Date;
  isMembership: boolean;
}

// 2. Тип документа (с методами Mongoose)
export type BlogDocument = HydratedDocument<IBlog>;

// 3. Тип модели
type BlogModel = Model<IBlog>;

//
const BlogSchema = new mongoose.Schema<IBlog, BlogModel>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
}, {
  timestamps: true
})

// 5. Создание модели
export const BlogModel: BlogModel = model<IBlog, BlogModel>('Blog', BlogSchema)