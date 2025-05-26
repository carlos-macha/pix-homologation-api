import { Request, Response, NextFunction } from "express";

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error({error: error});

    const status = error.status || 500;
    const message = error.message || "Internal Server Error";

    res.status(status).json({
        error: {
            message: message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        }
    });
};

export default errorHandler;