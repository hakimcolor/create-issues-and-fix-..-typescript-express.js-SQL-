import type { Request, Response } from "express";
import { deleteIssueService } from "../service/issue.service.js";

export const deleteIssue = async (req:Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = req.user;

    await deleteIssueService(id as string, user);

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {

    const err = error as Error;

    if (err.message === "Issue not found") {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
        errors: err.message,
      });
    }

    if (err.message === "Only maintainer can delete issues") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
        errors: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete issue",
      errors: err.message,
    });

}
};