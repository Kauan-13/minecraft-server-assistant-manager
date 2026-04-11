import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

const errorMiddleware = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
};

export default errorMiddleware;