import { body } from 'express-validator';
import { idValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';
import { ResourceType } from '../../core/consts/resource-type';

const titleValidation = body('data.attributes.title')
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

const shortDescriptionValidation = body('data.attributes.shortDescription')
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

const contentValidation = body('data.attributes.content')
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
  .isLength({ max: 1000 })
  .withMessage('Content must be fewer than 1000 characters');

const blogIdValidation = body('data.attributes.blogId')
  .exists()
  .withMessage('BlogId is required')
  .bail()
  .isString()
  .withMessage('BlogId should be string');

export const postCreateInputValidation = [
  resourceTypeValidation(ResourceType.Posts),
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const postUpdateInputValidation = [
  resourceTypeValidation(ResourceType.Posts),
  idValidation,
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
