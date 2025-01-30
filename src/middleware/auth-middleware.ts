import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { prismaClient } from "../application/database";
import { UserRequest } from "../type/user-request";
import CONFIG from "../libs/config";

export const authMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ errors: "Unauthorized" }).end();

        const token = authHeader!.split(" ")[1];
        if (!token)
            return res.status(401).json({ errors: "Unauthorized" }).end();

        const decoded = jwt.verify(token, CONFIG.JWT.SECRET!) as {
            id?: string;
        };

        if (!decoded?.id)
            return res.status(401).json({ errors: "Unauthorized" }).end();

        const user = await prismaClient.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if (!user)
            return res.status(401).json({ errors: "Unauthorized" }).end();

        req.user = user;
        next();
    } catch (error : any) {
        return res.status(401).json({ errors: error.message }).end();
    }
};
