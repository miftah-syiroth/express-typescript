export type CreateUserRequest = {
    email: string;
    name: string;
    password: string;
};

export type UserResponse = {
    id: string;
    email: string;
    name: string;
};