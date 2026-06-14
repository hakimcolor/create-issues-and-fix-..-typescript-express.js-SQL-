import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllIssuesService } from '../service/issue.service.js';

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    // Extract and pass query parameters for filtering and sorting
    const queryParams = req.query;

    // Fetch all issues with optional filters applied
    const result = await getAllIssuesService(queryParams);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issues retrived successfully',
      data: result,
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch issues',
      errors: (error as Error).message,
    });
  }
};
