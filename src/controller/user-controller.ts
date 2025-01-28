import { NextFunction, Request, Response } from "express";
import { UserService } from "../service/user-service";
import { CreateUserRequest, LoginRequest } from "../model/user-model";

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
            
            res.status(200).json({
                data: response
            })
        } catch (error) {
            next(error);
        }
    }

    // static async refresh(req, res) {
    //     const user = await UserService.refreshToken(req.body);
    //     res.json(user);
    // }

    // static async logout(req, res) {
    //     await UserService.logout(req.body);
    //     res.json({
    //         message: "Logout success",
    //     });
    // }
}
