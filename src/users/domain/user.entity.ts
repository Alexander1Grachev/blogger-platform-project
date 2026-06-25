
import mongoose, { HydratedDocument, model, Model } from "mongoose";
import { UserInputDto } from "../routers/input/user-input-dto";
import crypto from 'crypto';
import { addHours } from 'date-fns';



export class UserEntity {
  createdAt!: Date;
  updatedAt!: Date;
  private constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public emailConfirmation: {
      confirmationCode: string
      expirationDate: Date,
      isConfirmed: boolean,
    },
    public passwordRecovery?: {
      recoveryCode: string,
      expirationDate: Date,
    },
  ) { }
  static createUser(passwordHash: string, dto: UserInputDto): UserDocument {
    return new UserModel({
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash
    }) as UserDocument
  }
  static registerUser(passwordHash: string, dto: UserInputDto): UserDocument {
    return new UserModel({
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
      emailConfirmation: {
        confirmationCode: crypto.randomUUID(),
        expirationDate: addHours(new Date(), 1),
        isConfirmed: false, // ждёт подтверждения
      }
    }) as UserDocument;

  }
  confirmEmail(): void {
    this.emailConfirmation.isConfirmed = true;
  }

  updateEmailConfirmationCode(): string {
    const newCode = crypto.randomUUID();
    this.emailConfirmation.confirmationCode = newCode;
    this.emailConfirmation.expirationDate = addHours(new Date(), 1);
    return newCode;
  }
  updatePasswordRecoveryCode(): string {
    const newCode = crypto.randomUUID();
    this.passwordRecovery = {
      recoveryCode: newCode,
      expirationDate: addHours(new Date(), 1),
    };
    return newCode;
  }
  confirmPasswordRecovery(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
    this.passwordRecovery = undefined;
  }
}


interface UserMethods {
  confirmEmail(): void;
  updateEmailConfirmationCode(): string;
  updatePasswordRecoveryCode(): string;
  confirmPasswordRecovery(newPasswordHash: string): void;
}
interface UserStatics {
  createUser(passwordHash: string, dto: UserInputDto): UserDocument;
  registerUser(passwordHash: string, dto: UserInputDto): UserDocument;
}

type UserModel = Model<UserEntity, {}, UserMethods> & UserStatics;
export type UserDocument = HydratedDocument<UserEntity, UserMethods>;


const UserSchema = new mongoose.Schema<UserEntity, UserModel>({
  login: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String },
    expirationDate: { type: Date },
    isConfirmed: { type: Boolean },
  },
  passwordRecovery: {
    recoveryCode: { type: String },
    expirationDate: { type: Date },
  },
}, {  //  запятая и открытие ВТОРОГО аргумента (опции)
  timestamps: true
})  //  закрыли вызов Schema()

UserSchema.loadClass(UserEntity);

export const UserModel: UserModel = mongoose.model<UserEntity, UserModel>('User', UserSchema)




