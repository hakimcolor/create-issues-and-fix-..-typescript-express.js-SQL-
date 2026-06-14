import type { Request, Response } from "express";
import { loginUserService } from "../service/auth.loginUserService.js";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUserService(email, password);
  
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Login failed",
      errors: (error as Error).message,
    });
    
  }
};