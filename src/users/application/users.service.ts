import { BcryptService } from "../../auth/adapters/bcrypt.service";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { User } from "./dtos/user.dto";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import { UsersRepository } from "../repositories/users.repository";
import { UserQueryInput } from "../routers/input/user-query.input";
import { UserInputDto } from "../routers/input/user-input-dto";
import { WithId } from 'mongodb';
import { injectable, inject } from "inversify";
import { UserDocument, UserModel } from "../domain/user.entity";


@injectable()
export class UsersService {
  constructor(
    @inject(BcryptService) private readonly bcryptService: BcryptService,
    @inject(UsersQueryRepository) private readonly usersQueryRepository: UsersQueryRepository,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
  ) { }
  //---------------------------------
  async delete(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(dto: UserInputDto): Promise<string> {
    const existing = await this.usersQueryRepository.findForRegistration(dto.login, dto.email);
    if (existing) {
      if (existing.login === dto.login) {
        throw new BadRequestError('Login already exist', 'login')
      } else {
        throw new BadRequestError('Email already exist', 'email')
      }
    };
    const passwordHash = await this.bcryptService.generateHash(dto.password)

    const newUser = UserModel.createUser(passwordHash, dto)
    return this.usersRepository.save(newUser);
  }

  async findById(id: string): Promise<UserDocument> {
    return this.usersQueryRepository.findByIdOrFail(id);
  }
  async findMany(
    queryDto: UserQueryInput
  ): Promise<{ items: UserDocument[]; totalCount: number }> {
    return this.usersQueryRepository.findMany(queryDto);
  }
}