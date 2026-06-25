import { UserDocument } from "../../domain/user.entity";
import { UserViewModel } from "../output/user-view-model";

export function mapToUserOutput(user: UserDocument): UserViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}