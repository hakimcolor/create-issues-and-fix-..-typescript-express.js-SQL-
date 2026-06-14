import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { loginUserService } from '../service/auth.loginUserService.js';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // required login  present
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required',
        errors: 'email and password are required',
      });
    }

    // jwt for the user ...
    const result = await loginUserService(email, password);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    // if no user so ..
    if (
      err.message === 'User not found' ||
      err.message === 'Invalid password'
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Login failed',
        errors: err.message,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Something went wrong',
      errors: err.message,
    });
  }
};
