import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { deleteIssueService } from '../service/issue.service.js';

export const deleteIssue = async (req: Request, res: Response) => {
  try {
    // Extract issue ID from URL params
    const { id } = req.params;

    // Get authenticated user from JWT payload
    const user = req.user;

    // Delete the issue with maintainer-only permission check in service layer
    await deleteIssueService(id as string, user);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue deleted successfully',
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

    // Return 403 if user is not a maintainer
    if (err.message === 'Only maintainer can delete issues') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Forbidden access',
        errors: err.message,
      });
    }

    // Handle unexpected server errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete issue',
      errors: err.message,
    });
  }
};
