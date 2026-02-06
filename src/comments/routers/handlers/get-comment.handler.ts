import { errorsHandler } from "../../../core/errors/errors.handler";
import { Request, Response } from 'express';
import { mapToCommentOutput } from "../../application/mappers/map-to-comment-output.util";
import { HttpStatus } from "../../../core/consts/http-statuses";
import { commentsService } from "../../application/comments.service";



export async function getCommentHandler(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        const commentId = req.params.id;
        const comment = await commentsService.findByIdOrFail(commentId)
        const commentOutput = mapToCommentOutput(comment)
        res.status(HttpStatus.Ok).send(commentOutput)
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
}