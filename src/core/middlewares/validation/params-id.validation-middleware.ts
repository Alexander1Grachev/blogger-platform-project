import { param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .bail()
  .isString()
  .withMessage('ID must be a string')
  .bail()
  .isLength({ min: 1 })
  .withMessage('ID must not be empty') 
  
