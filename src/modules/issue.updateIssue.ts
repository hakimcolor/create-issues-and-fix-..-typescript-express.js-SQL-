import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { updateIssueService } from '../service/issue.service.js';

export const updateIssue = async (req: Request, res: Response) => {
  try {
    // Extract issue ID from URL params
    const { id } = req.params;

    // Get authenticated user from JWT payload
    const user = req.user;

    const { title, description, type, status } = req.body;

    // Validate that at least one field is provided for update
    if (!title && !description && !type && !status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors:
          'At least one field (title, description, type, status) is required',
      });
    }

    // Validate title length if provided
    if (title !== undefined && title.length > 150) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Title cannot exceed 150 characters',
      });
    }

    // Validate description minimum length if provided
    if (description !== undefined && description.length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Description must be at least 20 characters',
      });
    }

    // Validate type is one of the allowed values if provided
    if (type !== undefined && type !== 'bug' && type !== 'feature_request') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors: 'Invalid issue type',
      });
    }

    // Validate status is one of the allowed workflow states if provided
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

    // Apply update with role-based permission checks in service layer
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

    // Return 404 if issue does not exist
    if (err.message === 'Issue not found') {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Issue not found',
        errors: err.message,
      });
    }

    // Return 403 if user does not have permission to update this issue
    if (err.message === 'You are not allowed to update this issue') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Forbidden access',
        errors: err.message,
      });
    }

    // Return 409 if issue status prevents the update
    if (err.message === 'Only open issues can be updated') {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Issue update conflict',
        errors: err.message,
      });
    }

    // Handle unexpected server errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update issue',
      errors: err.message,
    });
  }
};
