


import { body } from 'express-validator';
import { LikeStatus } from '../../consts/like-statuses';

export const likeStatusValidation = body('likeStatus')
  .isIn(Object.values(LikeStatus))//передаёт массив значений
  .withMessage('likeStatus must be None, Like or Dislike')



