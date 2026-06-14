import type { Request, Response } from "express";
import { getAllIssuesService } from "../service/issue.service.js";

export const getAllIssues = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query;

    const result = await getAllIssuesService(queryParams);
    
    res.status(200).json({
      success: true,
      message : "Issues retrived successfully",
      data: result,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch issues",
      errors: (error as Error).message,
    });

  }
};
