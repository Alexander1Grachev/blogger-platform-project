import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { ObjectId } from 'mongodb';
import { IUser, UserModel } from "./models/user.model";
import { injectable } from "inversify";


@injectable()
export class UsersRepository {
  async delete(id: string): Promise<void> {
    const deleteResult = await UserModel.deleteOne({ _id: id })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('User does not exist');
    }
  }
  async create(newUser: IUser): Promise<string> {
    const result = await UserModel.insertOne(newUser);
    return result._id.toString();
  }

  async confirmEmail(
    userId: ObjectId,
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.isConfirmed': true,
        },
      },
    )
  }

  async updateEmailConfirmationCode(
    userId: ObjectId,
    newCode: string,
    newDate: Date
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          'emailConfirmation.confirmationCode': newCode,
          'emailConfirmation.expirationDate': newDate
        },
      },
    )
  }
  async updatePasswordRecoveryCode(
    userId: ObjectId,
    newCode: string,
    newDate: Date
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          'passwordRecovery.recoveryCode': newCode,
          'passwordRecovery.expirationDate': newDate
        },
      },
    )
  }

  async confirmPasswordRecovery(
    userId: ObjectId,
    newPasswordHash: string,
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      {
        $set: { passwordHash: newPasswordHash },
        $unset: { passwordRecovery: 1 }
      }
    )
  }
}