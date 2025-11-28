import { body } from 'express-validator';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id.validation-middleware';
import { ResourceType } from '../../core/consts/resource-type';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type.validation-middleware';

const nameValidation = body('data.attributes.name')
  .exists()
  .withMessage('Name is required')
  .bail()
  .isString()
  .withMessage('Name must be string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Name must not be empty')
  .bail()
  .isLength({ max: 15 })
  .withMessage('Name must be fewer than 15 characters');

const descriptionValidation = body('data.attributes.description')
  .exists()
  .withMessage('Description is required')
  .bail()
  .isString()
  .withMessage('Name must be string')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('Description must not be empty')
  .bail()
  .isLength({ max: 500 })
  .withMessage('Description must be fewer than 500 characters');

const websiteUrlValidation = body('data.attributes.websiteUrl')
  .exists()
  .withMessage('WebsiteUrl is required')
  .bail()
  .isString()
  .withMessage('WebsiteUrl must be string')
  .bail()
  .trim()
  .isLength({ max: 100 })
  .withMessage('WebsiteUrl must be fewer than 100 characters')
  .bail()
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  .withMessage('Invalid URL format. Example: https://example.com/path');

export const blogCreateInputValidation = [
  resourceTypeValidation(ResourceType.Blogs),
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];

export const blogUpdateInputValidation = [
  resourceTypeValidation(ResourceType.Blogs),
  dataIdMatchValidation,
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
