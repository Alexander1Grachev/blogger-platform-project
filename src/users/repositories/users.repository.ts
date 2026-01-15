import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { userCollection } from "../../db/mongo.db"
import { ObjectId } from 'mongodb';
import { IUserDB } from "../models/user.db.interface";

export const usersRepository = {
  async delete(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id) })
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError('User not exist');
    }
  },
  async create(newUser: IUserDB): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);
    return insertResult.insertedId.toString();
  },
}