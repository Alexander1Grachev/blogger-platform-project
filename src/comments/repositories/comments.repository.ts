import { ObjectId, WithId } from "mongodb";
import { Comment } from "../domain/comments";
import { commentCollection } from "../../db/mongo.db";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { CommentInputDto } from "../application/dtos/comment-input.dto";
import { CommentQueryInput } from "../routers/input/comment-query.input";

export const commentsRepository = {
  async findMany(
    postId: string,
    queryDto: CommentQueryInput
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    } = queryDto;

    const skip = (pageNumber - 1) * pageSize;
    const filter = { postId };

    const [items, totalCount] = await Promise.all([
      commentCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      commentCollection.countDocuments(filter)
    ]);
    return { items, totalCount };
  },
  async findByIdOrFail(id: string): Promise<WithId<Comment>> {
    const res = await commentCollection.findOne({ _id: new ObjectId(id) });
    if (!res) {
      throw new RepositoryNotFoundError('Comment not exist')
    }
    return res;
  },
  async delete(id: string): Promise<void> {
    const deleteResult = await commentCollection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('Comment not exist');
    }
    return;
  },
  async update(id: string, dto: CommentInputDto): Promise<void> {
    const updateResult = await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: dto.content,
        }
      });

    if (updateResult.matchedCount < 1) {
      throw new RepositoryNotFoundError('Comment not exist')
    }
    return;
  },
  async create(newComment: Comment): Promise<string> {
    const insertResult = await commentCollection.insertOne(newComment);
    return insertResult.insertedId.toString();
  }

}