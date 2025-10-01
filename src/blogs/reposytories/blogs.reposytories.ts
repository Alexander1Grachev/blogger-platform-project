import { db } from '../../db/in-memory.db';
import { Blog } from '../types/blog';
import { BlogInputDto } from '../dto/blog-input-model';
import { blogCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const blogsReposytory = {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogCollection.find().toArray();
  },
  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  },
  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },
  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await blogCollection.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      }
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Blog not exist');
    }

    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogCollection.deleteOne({ _id: new ObjectId(id) })

    if (deleteResult.deletedCount < 1) {
      throw new Error('Blog not exist');
    }
    return;
  },
};
