import { IComment, CommentModel } from "./models/comments.model";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentInputDto } from "../application/dtos/comment-input.dto";
import { injectable } from "inversify";


@injectable()
export class CommentsRepository {
  async delete(id: string): Promise<void> {
    const deleteResult = await CommentModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Comment does not exist');
    }
  }
  async update(id: string, dto: CommentInputDto): Promise<void> {
    const updateResult = await CommentModel.updateOne(
      { _id: id },
      {
        $set: {
          content: dto.content,
        }
      });

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Comment does not exist')
    }
  }
  async create(newComment: IComment): Promise<string> {
    const result = await CommentModel.create(newComment);
    return result._id.toString();
  }

}