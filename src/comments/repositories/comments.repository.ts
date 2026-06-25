import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { CommentDocument, CommentModel } from "../domain/comment.entity";


@injectable()
export class CommentsRepository {
  async delete(id: string): Promise<void> {
    const deleteResult = await CommentModel.deleteOne({ _id: id });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Comment does not exist');
    }
  }

  async save(newComment: CommentDocument): Promise<string> {
    const result = await newComment.save();
    return result._id.toString();
  }

}
