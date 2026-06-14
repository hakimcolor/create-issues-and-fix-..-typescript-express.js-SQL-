import type { Request, Response } from 'express';
import { updateIssueService } from '../service/issue.service.js';

export const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = req.user;

    const data = req.body;

    const { title, description, type } = req.body;

    if (!title?.trim() || !description?.trim() || !type?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: 'title, description and type are required',
      });
    }

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: 'Title cannot exceed 150 characters',
      });
    }

    if (description.length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: 'Description must be at least 20 characters',
      });
    }

    if (type !== 'bug' && type !== 'feature_request') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: 'Invalid issue type',
      });
    }

    const result = await updateIssueService(id as string, data, user);

    res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: result,
    });
  } catch (error) {
    const err = error as Error;

    if (err.message === 'Issue not found') {
      return res.status(404).json({
        success: false,
        message: 'Issue not found',
        errors: err.message,
      });
    }

    if (err.message === 'You are not allowed to update this issue') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden access',
        errors: err.message,
      });
    }

    if (err.message === 'Only open issues can be updated') {
      return res.status(409).json({
        success: false,
        message: 'Issue update conflict',
        errors: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update issue',
      errors: err.message,
    });
  }
};
