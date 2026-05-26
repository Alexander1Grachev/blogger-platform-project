import { WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { User } from "../application/dtos/user.dto";
import { UserQueryInput } from "../routers/input/user-query.input";
import { IUser, UserModel } from "./models/user.model";
import { injectable } from "inversify";


@injectable()
export class UsersQueryRepository {

  async findByIdOrFail(id: string): Promise<WithId<IUser>> {

    const res = await UserModel.findOne({ _id: id }).lean();
    if (!res) {
      throw new RepositoryNotFoundError('User does not exist');
    }
    return res;
  }
  async findForRegistration(login: string, email: string) {
    return UserModel.findOne({
      $or: [{ login: login }, { email: email }],
    }).lean();
  }
  async findForAuth(
    loginOrEmail: string
  ): Promise<WithId<IUser> | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    }).lean();

  }

  async findByConfirmationCode(
    confCode: string
  ): Promise<WithId<IUser> | null> {
    const user = await UserModel.findOne({
      'emailConfirmation.confirmationCode': confCode,
    }).lean();
    return user
  }

  async findByRecoveryCode(
    recoveryCode: string
  ): Promise<WithId<IUser> | null> {
    const user = await UserModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    }).lean();
    return user
  }

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
      UserModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      UserModel.countDocuments(filter)
    ]);
    return { items, totalCount }
  }
}