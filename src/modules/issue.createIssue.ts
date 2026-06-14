import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createIssueService } from '../service/issue.service.js';

export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, type } = req.body;

    if (!title?.trim() || !description?.trim() || !type?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All fields are required',
        errors: 'title, description and type are required',
      });
    }

    if (title.length > 150) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Title cannot exceed 150 characters',
        errors: 'Maximum title length is 150',
      });
    }

    if (description.length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Description must be at least 20 characters',
        errors: 'Minimum description length is 20',
      });
    }

    if (type !== 'bug' && type !== 'feature_request') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid issue type',
        errors: 'Type must be bug or feature_request',
      });
    }

    const reporter_id = req.user.id;

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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create issue',
      errors: (error as Error).message,
    });
  }
};
