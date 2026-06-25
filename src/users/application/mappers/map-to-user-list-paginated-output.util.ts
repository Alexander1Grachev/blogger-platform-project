
import { UserListPaginatedOutput } from "../output/user-list-paginated.output";
import { UserViewModel } from "../output/user-view-model";
import { UserDocument } from "../../domain/user.entity";

export function mapToUserListPaginatedOutput(
  users: UserDocument[],
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