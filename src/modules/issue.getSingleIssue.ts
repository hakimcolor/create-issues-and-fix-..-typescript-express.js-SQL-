import type { Request, Response } from "express";
import { getSingleIssueService } from "../service/issue.service.js";

export const getSingleIssue = async (req: Request,res: Response) => {
  try {
    const { id } = req.params;

    const result = await getSingleIssueService(id as string);

    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });

  } catch (error) {

    res.status(404).json({
      success: false,
      message: (error as Error).message,
    });
    
  }
};