import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getSingleIssueService } from '../service/issue.service.js';

export const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await getSingleIssueService(id as string);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue retrived successfully',
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    if (err.message === 'Issue not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
        errors: err.message,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch issue',
      errors: err.message,
    });
  }
};
