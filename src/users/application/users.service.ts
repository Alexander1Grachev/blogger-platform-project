import { BcryptService } from "../../auth/adapters/bcrypt.service";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { User } from "./dtos/user.dto";
import { IUserDB } from "../repositories/models/user.db.interface";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import { UsersRepository } from "../repositories/users.repository";
import { UserQueryInput } from "../routers/input/user-query.input";
import { UserInputDto } from "../routers/input/user-input-dto";
import { WithId } from 'mongodb';



export class UsersService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  //---------------------------------
  async delete(id: string): Promise<void> {
    return this.usersRepository.delete(id);
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
    const newUser: IUserDB = {
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
      createdAt: new Date(),
    }
    return this.usersRepository.create(newUser);
  }
  async findByIdOrFail(id: string): Promise<WithId<IUserDB>> {
    return this.usersQueryRepository.findByIdOrFail(id);
  }
  async findMany(
    queryDto: UserQueryInput
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    return this.usersQueryRepository.findMany(queryDto);
  }
}