import { log } from 'winston';
import jwt from "jsonwebtoken";
import {
    CreateUserRequest,
    LoginRequest,
    toUserResponse,
    UserResponse,
} from "../model/user-model";
import { Validation } from "../validation/validation";
import { UserValidation } from "../validation/user-validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import bcrypt from "bcrypt";
// import { generateAccessToken, generateRefreshToken } from "../libs/jwt";
import { Request } from "express";
import CONFIG from "../libs/config";
import { access } from "fs";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const validated = Validation.validate(UserValidation.REGISTER, request);

        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: validated.email,
            },
        });

        if (totalUserWithSameEmail) {
            throw new ResponseError(400, "Email already exists");
        }

        validated.password = await bcrypt.hash(validated.password, 10);

        const user = await prismaClient.user.create({
            data: validated,
        });

        return toUserResponse(user);
    }

    static async login(request: LoginRequest): Promise<UserResponse> {
        const validated = Validation.validate(UserValidation.LOGIN, request);

        const user = await prismaClient.user.findUnique({
            where: {
                email: validated.email,
            },
        });

        if (
            !user ||
            !(await bcrypt.compare(validated.password, user.password!))
        ) {
            throw new ResponseError(401, "Incorrect email or password");
        }

        const access_token = jwt.sign({ id: user.id }, CONFIG.JWT.SECRET, {
            expiresIn: "1d",
        });
        const refresh_token = jwt.sign(
            { id: user.id },
            CONFIG.JWT.REFRESH_SECRET,
            {
                expiresIn: "7d",
            }
        );

        await prismaClient.refreshToken.create({
            data: {
                token: refresh_token,
                userId: user.id,
            },
        });

        const response = toUserResponse(user);
        response.access_token = access_token;
        response.refresh_token = refresh_token;
        return response;
    }

    static async refresh(request: Request): Promise<string> {
        const cookies = request.cookies;

        // jangan lupa penamaan cookie harus sama dengan yang di set pada saat login
        if (!cookies?.refresh_token) throw new ResponseError(401, "no content");
        const refreshToken = cookies.refresh_token;

        const foundRefreshToken = await prismaClient.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });
        if (!foundRefreshToken) throw new ResponseError(403, "Forbidden");

        const decoded = jwt.verify(refreshToken, CONFIG.JWT.REFRESH_SECRET) as { id?: string };

        if (!decoded?.id || foundRefreshToken.userId !== decoded.id) {
            throw new ResponseError(403, "Forbidden");
        }

        const access_token = jwt.sign(
            { "id": decoded.id },
            CONFIG.JWT.SECRET,
            { expiresIn: '1d' }
        );

        return access_token;
    }

    static async logout(request: Request) {
        const cookies = request.cookies;

        // jangan lupa penamaan cookie harus sama dengan yang di set pada saat login
        if (!cookies?.refresh_token) return;
        const refreshToken = cookies.refresh_token;

        const foundRefreshToken = await prismaClient.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });
        if (!foundRefreshToken){
            return;
        }

        await prismaClient.refreshToken.delete({
            where: {
                token: refreshToken,
            },
        });
        return;
    }
}
