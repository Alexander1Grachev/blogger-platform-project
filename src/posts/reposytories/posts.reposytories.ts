import { Post } from '../domain/post';
import { PostAttributes } from '../application/dtos/post-attributes';
import { postCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { PostQueryInput } from '../routers/input/post-query.input';

export const postsRepository = {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;

    const skip = (pageNumber - 1) * pageSize;

    const filter = {};

    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    const res = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError('Post not exist');
    }

    return res;
  },

  async create(newPost: Post): Promise<string> {
    const insertResult = await postCollection.insertOne(newPost);

    return insertResult.insertedId.toString();
  },

  async update(id: string, input: PostAttributes): Promise<void> {
    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: input.title,
          shortDescription: input.shortDescription,
          content: input.content,
          blogId: input.blogId,
        },
      },
    );
    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return;
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await postCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Post not exist');
    }
    return;
  },
  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter = { blogId };

    const [items, totalCount] = await Promise.all([
      postCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },
};
