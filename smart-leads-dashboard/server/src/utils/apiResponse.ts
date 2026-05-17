import { Response } from 'express';
import { PaginationMeta } from '../types/common.types';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
  pagination?: PaginationMeta
): void => {
  res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    data,
    ...(pagination && { pagination }),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400
): void => {
  res.status(statusCode).json({ success: false, message });
};
