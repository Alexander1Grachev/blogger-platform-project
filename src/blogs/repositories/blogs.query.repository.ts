import { IBlog } from './models/blog.model';
import { BlogModel } from './models/blog.model';

import { ObjectId, WithId } from 'mongodb';
import { BlogQueryInput } from '../routers/input/blog-query.input';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { injectable } from "inversify";

@injectable()
export class BlogsQueryRepository {
  async findMany(
    queryDto: BlogQueryInput
  ): Promise<{
    items: WithId<IBlog>[];
    totalCount: number;
  }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm,
    } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }
    const [items, totalCount] = await Promise.all([
      BlogModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      BlogModel.countDocuments(filter)
    ])

    return { items, totalCount };
  }

  async findByIdOrFail(id: string): Promise<WithId<IBlog>> {
    const res = await BlogModel.findOne({ _id: id }).lean();
    if (!res) {
      throw new RepositoryNotFoundError('Blog does not exist');
    }
    return res;
  }
};
