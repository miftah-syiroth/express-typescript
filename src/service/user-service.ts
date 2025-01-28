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
import { generateAccessToken, generateRefreshToken } from "../libs/jwt";

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

        const access_token = generateAccessToken({ id: user.id });
        const refresh_token = generateRefreshToken({ id: user.id });

        const response = toUserResponse(user);
        response.access_token = access_token;
        response.refresh_token = refresh_token;
        return response;
    }
}
