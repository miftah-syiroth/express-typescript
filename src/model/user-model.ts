import { User } from "@prisma/client";

export type CreateUserRequest = {
    email: string;
    name: string;
    password: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type UserResponse = {
    id: string;
    email: string;
    name: string;
    access_token?: string;
    refresh_token?: string;
};

export function toUserResponse(user: User): UserResponse {
    return {
        id: user.id,
        email: user.email,
        name: user.name!
    };
}