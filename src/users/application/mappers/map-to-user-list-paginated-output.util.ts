import { WithId } from "mongodb";
import { User } from "../../domain/user";
import { UserListPaginatedOutput } from "../output/user-list-paginated.output";
import { UserViewModel } from "../../application/dtos/user-view-model";

export function mapToUserListPaginatedOutput(
    users: WithId<User>[],
    meta: { pageNumber: number, pageSize: number, totalCount: number }
): UserListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map((user): UserViewModel => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        }))
    };
}