import { body, param } from 'express-validator';

export const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Valid source is required'),
  body('notes').optional().isString(),
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source'),
  body('notes').optional().isString(),
];

export const leadIdValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
];
