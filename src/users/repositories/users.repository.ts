import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { injectable } from "inversify";
import { UserDocument, UserModel } from "../domain/user.entity";


@injectable()
export class UsersRepository {
  async delete(id: string): Promise<void> {
    const deleteResult = await UserModel.deleteOne({ _id: id })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('User does not exist');
    }
  }

  async save(newUser: UserDocument): Promise<string> {
    const result = await newUser.save();
    return result._id.toString();
  }
}