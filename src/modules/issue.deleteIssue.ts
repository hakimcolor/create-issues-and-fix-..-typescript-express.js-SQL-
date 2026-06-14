import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { deleteIssueService } from '../service/issue.service.js';

export const deleteIssue = async (req: Request, res: Response) => {
  try {
  
    const { id } = req.params;

    
    const user = req.user;

  
    await deleteIssueService(id as string, user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue deleted successfully',
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

  
    if (err.message === 'Only maintainer can delete issues') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Forbidden access',
        errors: err.message,
      });
    }

  
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete issue',
      errors: err.message,
    });
  }
};
