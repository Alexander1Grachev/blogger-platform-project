import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { userCollection } from "../../infrastructure/db/mongo.db";
import { ObjectId } from 'mongodb';
import { IUserDB } from "./models/user.db.interface";
import { injectable } from "inversify";


@injectable()
export class UsersRepository {
  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id) })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('User not exist');
    }
  }
  async create(newUser: IUserDB): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);
    return insertResult.insertedId.toString();
  }

  async confirmEmail(
    userId: ObjectId,
  ): Promise<void> {
    await userCollection.updateOne(
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
    await userCollection.updateOne(
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
    await userCollection.updateOne(
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
    await userCollection.updateOne(
      { _id: userId },
      {
        $set: { passwordHash: newPasswordHash },
        $unset: { passwordRecovery: 1 }
      }
    )
  }
}