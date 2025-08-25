import { body } from 'express-validator';

const titleValidation = body('title')
  .exists()
  .withMessage('Title is required')
  .bail()
  .isString()
  .withMessage('Title should be string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Title must not be empty')
  .bail()
  
  .isLength({ max: 30 })
  .withMessage('Title must be fewer than 30 characters');

const shortDescriptionValidation = body('shortDescription')
  .exists()
  .withMessage('ShortDescription is required')
  .bail()
  .isString()
  .withMessage('ShortDescription should be string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('ShortDescription must not be empty')
  .bail()
  .isLength({ max: 100 })
  .withMessage('ShortDescription must be fewer than 100 characters');

const contentValidation = body('content')
  .exists()
  .withMessage('Content is required')
  .bail()
  .isString()
  .withMessage('Content should be string')
  .bail()
  .trim()
  .isLength({ max: 1000 })
  .withMessage('Content must be fewer than 1000 characters')



  const blogIdValidation = body('blogId')
  .exists()
  .withMessage('BlogId is required')
  .bail()
  .isString()
  .withMessage('BlogId should be string')


export const postInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
