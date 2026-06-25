import { WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentQueryInput } from "../routers/input/comment-query.input";
import { injectable } from "inversify";
import { CommentDocument, CommentModel } from "../domain/comment.entity";


@injectable()
export class CommentsQueryRepository {
  async findMany(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: CommentDocument[]; totalCount: number }> {
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
        .limit(pageSize),
      CommentModel.countDocuments(filter)
    ]);
    return { items, totalCount };
  }
  async findByIdOrFail(id: string): Promise<CommentDocument> {
    const res = await CommentModel.findOne({ _id: id });
    if (!res) {
      throw new RepositoryNotFoundError('Comment does not exist')
    }
    return res;
  }
  
}