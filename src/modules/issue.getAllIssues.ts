import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllIssuesService } from '../service/issue.service.js';

export const getAllIssues = async (req: Request, res: Response) => {
  try {
 
    const queryParams = req.query;

 
    const result = await getAllIssuesService(queryParams);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issues retrived successfully',
      data: result,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch issues',
      errors: (error as Error).message,
    });
  }
};
