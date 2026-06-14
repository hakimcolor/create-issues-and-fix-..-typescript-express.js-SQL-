import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createUserService } from '../service/auth.createUserService.js';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

  
    if (!name || !email || !password || !role) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required',
        errors: 'name, email, password and role are required',
      });
    }

    // contributor role chake 
    if (role !== 'contributor' && role !== 'maintainer') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid role',
        errors: 'Role must be contributor or maintainer',
      });
    }

    const result = await createUserService(name, email, password, role);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    //  email...
    if (err.message === 'Email already exists') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Email already exists',
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
