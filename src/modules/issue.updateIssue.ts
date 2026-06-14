import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { updateIssueService } from '../service/issue.service.js';

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = req.user;

    const { title, description, type, status } = req.body;

    if (!title && !description && !type && !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors:
          'At least one field (title, description, type, status) is required',
      });
    }

    if (title !== undefined && title.length > 150) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Title cannot exceed 150 characters',
      });
    }

    if (description !== undefined && description.length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Description must be at least 20 characters',
      });
    }

    if (type !== undefined && type !== 'bug' && type !== 'feature_request') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Invalid issue type',
      });
    }

    if (
      status !== undefined &&
      status !== 'open' &&
      status !== 'in_progress' &&
      status !== 'resolved'
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Status must be open, in_progress or resolved',
      });
    }

    const result = await updateIssueService(
      id as string,
      { title, description, type, status },
      user
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Issue updated successfully',
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

    if (err.message === 'You are not allowed to update this issue') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Forbidden access',
        errors: err.message,
      });
    }

    if (err.message === 'Only open issues can be updated') {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Issue update conflict',
        errors: err.message,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update issue',
      errors: err.message,
    });
  }
};
