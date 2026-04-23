import { ObjectId, WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { User } from "../application/dtos/user.dto";
import { userCollection } from "../../infrastructure/db/mongo.db";
import { UserQueryInput } from "../routers/input/user-query.input";
import { IUserDB } from "./models/user.db.interface";
import { BadRequestError } from "../../core/errors/bad-request.error";


export const usersQueryRepository = {

  async findByIdOrFail(id: string): Promise<WithId<IUserDB>> {
    console.log('FIND BY ID:', id);

    const res = await userCollection.findOne({ _id: new ObjectId(id) });
    console.log('FOUND USER:', res);

    if (!res) {
      throw new RepositoryNotFoundError('User not exist');
    }
    return res;
  },
  async findForRegistration(login: string, email: string) {
    return userCollection.findOne({
      $or: [{ login: login }, { email: email }],
    });
  },
  async findForAuth(
    loginOrEmail: string
  ): Promise<WithId<IUserDB> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

  },

  async findByConfirmationCode(
    confCode: string
  ): Promise<WithId<IUserDB>> {
    const user = await userCollection.findOne({
      'emailConfirmation.confirmationCode': confCode,
    })
    if (!user) {
      throw new BadRequestError('Invalid confirmation code', 'code');
    }
    return user
  },

  async findMany(
    queryDto: UserQueryInput
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    } = queryDto;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};
    const or: any[] = [];

    if (typeof searchLoginTerm === 'string' && searchLoginTerm.trim() !== '') {
      or.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }

    if (typeof searchEmailTerm === 'string' && searchEmailTerm.trim() !== '') {
      or.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }

    if (or.length > 0) {
      filter.$or = or;
    }

    const [items, totalCount] = await Promise.all([
      userCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      userCollection.countDocuments(filter)
    ]);
    return { items, totalCount }
  }
}