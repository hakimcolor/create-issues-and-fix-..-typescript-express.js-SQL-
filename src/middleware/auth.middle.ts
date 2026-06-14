import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../utils/index.js';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract JWT token from Authorization header
    const token = req.headers.authorization;

    // Reject request if token is missing
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized access',
        errors: 'JWT token is missing',
      });
    }

    // Verify token signature and expiry, then attach decoded payload to request
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    // Handle invalid or expired token
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid token',
      errors: (error as Error).message,
    });
  }
};
