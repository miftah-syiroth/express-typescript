import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = async (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof ZodError) {
        return res.status(422).json({
            errors: error.errors.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            })),
        });
    } else if (error instanceof ResponseError) {
        return res.status(error.status).json({
            errors: error.message,
        });
    } else {
        return res.status(500).json({
            errors: error.message,
        });
    }
};
