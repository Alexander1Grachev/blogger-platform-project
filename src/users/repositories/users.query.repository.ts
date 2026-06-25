import { WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { UserQueryInput } from "../routers/input/user-query.input";
import { injectable } from "inversify";
import { UserDocument, UserModel } from "../domain/user.entity";


@injectable()
export class UsersQueryRepository {

  async findByIdOrFail(id: string): Promise<UserDocument> {

    const res = await UserModel.findOne({ _id: id });
    if (!res) {
      throw new RepositoryNotFoundError('User does not exist');
    }
    return res;
  }
  async findForRegistration(login: string, email: string) {
    return UserModel.findOne({
      $or: [{ login: login }, { email: email }],
    });
  }
  async findForAuth(
    loginOrEmail: string
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

  }

  async findByConfirmationCode(
    confCode: string
  ): Promise<UserDocument | null> {
    const user = await UserModel.findOne({
      'emailConfirmation.confirmationCode': confCode,
    });
    return user
  }

  async findByRecoveryCode(
    recoveryCode: string
  ): Promise<UserDocument | null> {
    const user = await UserModel.findOne({
      'passwordRecovery.recoveryCode': recoveryCode,
    });
    return user
  }

  async findMany(
    queryDto: UserQueryInput
  ): Promise<{ items: UserDocument[]; totalCount: number }> {
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
        .limit(pageSize),
      UserModel.countDocuments(filter)
    ]);
    return { items, totalCount }
  }
}