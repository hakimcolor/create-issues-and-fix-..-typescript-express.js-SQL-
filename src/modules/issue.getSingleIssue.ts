import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getSingleIssueService } from '../service/issue.service.js';

export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    // Extract issue ID from URL params
    const { id } = req.params;

    // Fetch the specific issue with reporter details
    const result = await getSingleIssueService(id as string);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue retrived successfully',
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    // Return 404 if issue does not exist
    if (err.message === 'Issue not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
        errors: err.message,
      });
    }

    // Handle unexpected server errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch issue',
      errors: err.message,
    });
  }
};
