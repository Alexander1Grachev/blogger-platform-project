import { WithId } from "mongodb";
import { IComment, CommentModel } from "./models/comments.model";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { injectable } from "inversify";


@injectable()
export class CommentsQueryRepository {
  async findMany(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: WithId<IComment>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { postId };

    const [items, totalCount] = await Promise.all([
      CommentModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      CommentModel.countDocuments(filter)
    ]);
    return { items, totalCount };
  }
  async findByIdOrFail(id: string): Promise<WithId<IComment>> {
    const res = await CommentModel.findOne({ _id: id }).lean();
    if (!res) {
      throw new RepositoryNotFoundError('Comment does not exist')
    }
    return res;
  }
  
}