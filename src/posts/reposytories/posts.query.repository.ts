import { IPost } from './models/post.model';
import { PostModel } from './models/post.model';

import {  WithId } from 'mongodb';
import { PostQueryInput } from '../routers/input/post-query.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";


@injectable()
export class PostsQueryRepository {
  async findMany(
    queryDto: PostQueryInput
  ): Promise<{ items: WithId<IPost>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    const [items, totalCount] = await Promise.all([
      PostModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PostModel.countDocuments(filter)
    ]);
    return { items, totalCount };
  }

  async findByIdOrFail(id: string): Promise<WithId<IPost>> {
    const res = await PostModel.findOne({ _id: id }).lean();
    if (!res) {
      throw new RepositoryNotFoundError('Post does not exist');
    }
    return res;
  }

  async getPostForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<IPost>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter = { 'blogId': blogId };

    const [items, totalCount] = await Promise.all([
      PostModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      PostModel.countDocuments(filter),
    ]);
    return { items, totalCount };
  }
};
