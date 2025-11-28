import { body, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .bail()
  .isString()
  .withMessage('ID must be a string')
  .bail()
  .isMongoId()
  .withMessage('ID must not be empty');

export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID is required')
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error('ID in URL and body must match');
    }
    return true;
  });
