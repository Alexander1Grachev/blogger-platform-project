import { WithId } from "mongodb";
import { UserViewModel } from "../../application/dtos/user-view-model";
import { User } from "../../domain/user";

export function mapToUserOutput(user: WithId<User>): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
}