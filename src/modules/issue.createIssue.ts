import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createIssueService } from '../service/issue.service.js';

export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    // Validate all required fields are present and not empty
    if (!title?.trim() || !description?.trim() || !type?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required',
        errors: 'title, description and type are required',
      });
    }

    // Validate title does not exceed maximum character limit
    if (title.length > 150) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title cannot exceed 150 characters',
        errors: 'Maximum title length is 150',
      });
    }

    // Validate description meets minimum character requirement
    if (description.length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Description must be at least 20 characters',
        errors: 'Minimum description length is 20',
      });
    }

    // Validate type is one of the allowed issue categories
    if (type !== 'bug' && type !== 'feature_request') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid issue type',
        errors: 'Type must be bug or feature_request',
      });
    }

    // Extract reporter identity from decoded JWT payload
    const reporter_id = req.user.id;

    // Persist the new issue via service layer
    const result = await createIssueService(
      title,
      description,
      type,
      reporter_id
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Issue created successfully',
      data: result,
    });
  } catch (error) {
    // Handle unexpected server errors
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create issue',
      errors: (error as Error).message,
    });
  }
};
