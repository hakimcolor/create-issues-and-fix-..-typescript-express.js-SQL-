import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import type { JwtPayload } from "../utils";

export const auth = (req : Request, res : Response, next : NextFunction) => {
    try{
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
                errors: "JWT token is missing",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        req.user = decoded;
        
        next();

    }catch(error){

        return res.status(401).json({
            success: false,
            message: "Invalid token",
            errors: (error as Error).message,
        });

    }
}