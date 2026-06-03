import mongoose, { HydratedDocument, model, Model } from "mongoose";



export interface IUser {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  emailConfirmation?: {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean,
  },
  passwordRecovery?: {
    recoveryCode: string,
    expirationDate: Date,
  },
}
export type UserDocument = HydratedDocument<IUser>
type UserModel = Model<IUser>;


const UserSchema = new mongoose.Schema<IUser, UserModel>({
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

export const UserModel: UserModel = model<IUser, UserModel>('User', UserSchema)

