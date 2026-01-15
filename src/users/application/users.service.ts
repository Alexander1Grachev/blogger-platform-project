import { bcryptService } from "../../auth/auth.service.ts/bcrypt.service";
import { BadRequestError } from "../../core/errors/bad-request.error";
import { User } from "../domain/user";
import { IUserDB } from "../models/user.db.interface";
import { usersQueryRepository } from "../repositories/users.query.repository";
import { usersRepository } from "../repositories/users.repository";
import { UserQueryInput } from "../routers/input/user-query.input";
import { UserInputDto } from "./dtos/user-input-dto";
import {  WithId } from 'mongodb';



export const usersService = {
  async delete(id: string): Promise<void> {
    return usersRepository.delete(id);
  },
  async create(dto: UserInputDto): Promise<string> {
    const existing = await usersQueryRepository.findForRegistration(dto.login, dto.email);
    if (existing) {
      if (existing.login === dto.login) {
        throw new BadRequestError('Login already exist')
      } else {
        throw new BadRequestError('Email already exist')
      }
    };
    const passwordHash = await bcryptService.generateHash(dto.password)
    const newUser: IUserDB = {
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
      createdAt: new Date(),
    }
    return usersRepository.create(newUser);
  },
  async findByIdOrFail(id: string): Promise<WithId<User>> {
    return usersQueryRepository.findByIdOrFail(id);
  },
  async findMany(
    queryDto: UserQueryInput
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    return usersQueryRepository.findMany(queryDto);
  }
}