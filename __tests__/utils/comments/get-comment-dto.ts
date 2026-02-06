import { CommentInputDto } from "../../../src/comments/application/dtos/comment-input.dto";



export function getCommentDto(): CommentInputDto {
    return {
        content: `content_${Date.now()}`,
    };
}
