import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { sendError, sendSuccess } from '../utils/apiResponse';

const sanitizeUser = (user: InstanceType<typeof User>) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'admin' | 'sales';
    };

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      sendError(res, 'User already exists', 409);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'sales',
    });

    const token = generateToken(user._id.toString(), user.role);

    sendSuccess(
      res,
      { user: sanitizeUser(user), token },
      201,
      'User registered successfully'
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, errors.array()[0].msg, 400);
      return;
    }

    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    sendSuccess(res, { user: sanitizeUser(user), token }, 200, 'Login successful');
  } catch (error) {
    next(error);
  }
};
