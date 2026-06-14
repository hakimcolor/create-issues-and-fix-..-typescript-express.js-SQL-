import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../utils/index.js';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // jwt token ..
    const token = req.headers.authorization;

    // if token is missing so not show and error show ..
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized access',
        errors: 'JWT token is missing',
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
      errors: (error as Error).message,
    });
  }
};
