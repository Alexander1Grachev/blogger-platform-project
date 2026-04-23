import { WithId } from "mongodb";
import { UserViewModel } from "../output/user-view-model";
import { User } from "../dtos/user.dto";

export function mapToUserOutput(user: WithId<User>): UserViewModel {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
    };
}