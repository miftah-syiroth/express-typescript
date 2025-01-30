import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { CreateUserRequest, LoginRequest } from "../model/user-model";
import CONFIG from "../libs/config";
import { ResponseError } from "../error/response-error";
import { prismaClient } from "../application/database";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);

            res.status(200).json({
                data: response,
            });
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginRequest = req.body as LoginRequest;
            const response = await UserService.login(request);
            
            res.cookie(CONFIG.COOKIE.NAME, response.refresh_token!, {
                httpOnly: true,
                sameSite: "none",
                secure: true, // CONFIG.ENV === "production" || CONFIG.ENV === "stage",
                maxAge: 1000 * 60 * 60 * 24 * 7, // 30 days
              });

            const { refresh_token, ...filteredResponse } = response;

            res.status(200).json({
                data: filteredResponse
            })
        } catch (error) {
            next(error);
        }
    }

    static async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await UserService.refresh(req);
            res.status(200).json({
                data: {
                    'access_token': response
                }
            })
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await UserService.logout(req);
            res.clearCookie(CONFIG.COOKIE.NAME, { 
                httpOnly: true, 
                sameSite: 'none', 
                secure: true 
            });

            res.json({
                message: "Logout success",
            });
        } catch (error) {
            next(error);
        }
    }
}
