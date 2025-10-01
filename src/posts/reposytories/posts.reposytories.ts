import { db } from '../../db/in-memory.db';
import { Post } from '../types/post';
import { PostInputDto } from '../dto/post-input-model';
import { postCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const postsReposytory = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) })
  },

  async create(newPost: Post): Promise<WithId<Post>> {
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };;
  },

  async update(id: string, input: PostInputDto): Promise<void> {
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: input.title,
          shortDescription: input.shortDescription,
          content: input.content,
          blogId: new ObjectId(input.blogId)
        }
      },
    );
    if (updateResult.matchedCount < 1) {
      throw new Error('Post not exist');
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) })
    if (deleteResult.deletedCount < 1) {
      throw new Error('Post not exist');
    }
    return;
  },
};
