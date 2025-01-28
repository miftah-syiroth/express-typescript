import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { prismaClient } from "../application/database";
import { UserRequest } from "../type/user-request";
import CONFIG from "../libs/config";
import { log } from "console";

export const authMiddleware = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) res.status(401).json({ errors: "Unauthorized" }).end();

    const token = authHeader!.split(" ")[1];
    if (!token) res.status(401).json({ errors: "Unauthorized" }).end();

    const decoded = jwt.verify(token, CONFIG.JWT.SECRET!) as {
        id?: string;
    };

    if (!decoded?.id) res.status(401).json({ errors: "Unauthorized" }).end();

    const user = await prismaClient.user.findUnique({
        where: {
            id: decoded.id,
        },
    });

    if (user) {
        req.user = user;
        next();
        return;
    }

    return res.status(401).json({ errors: "Unauthorized" }).end();
};
