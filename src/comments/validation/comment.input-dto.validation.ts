import { body } from 'express-validator';

const contentValidation = body('content')
  .exists()
  .withMessage('Content is required')
  .bail()
  .isString()
  .withMessage('Content should be string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Content must not be empty')
  .bail()
  .isLength({ min: 20, max: 300 })
  .withMessage('Content must be between 20 and 300 characters');


export const CommentInputDtoValidation = [
  contentValidation,
]
