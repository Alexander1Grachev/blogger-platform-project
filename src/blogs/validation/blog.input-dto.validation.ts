import { body } from 'express-validator';

const nameValidation = body('name')
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

const descriptionValidation = body('description')
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

const websiteUrlValidation = body('websiteUrl')
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

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
];
