import mongoose, { HydratedDocument, model, Model } from 'mongoose'


export interface IPost {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  updatedAt: Date;
};


export type PostDocument = HydratedDocument<IPost>;
type PostModel = Model<IPost>;

const PostSchema = new mongoose.Schema<IPost, PostModel>({
  title: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
}, {
  timestamps: true
})


export const PostModel: PostModel = model<IPost, PostModel>('Post', PostSchema)