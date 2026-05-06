import type { Request, Response } from 'express';
import AppError from '../utils/AppError.js';

const errorMiddleware = (
    err: Error, 
    req: Request, 
    res: Response
) => {
    const statusCode = err instanceof AppError ? err.statusCode : 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message
    });
};

export default errorMiddleware;