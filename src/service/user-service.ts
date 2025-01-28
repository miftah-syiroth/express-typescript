import { User } from '@prisma/client';
import { CreateUserRequest, UserResponse } from '../model/user-model';
import { Validation } from '../validation/validation';
import { UserValidation } from '../validation/user-validation';
import { prismaClient } from '../application/database';
import { ResponseError } from '../error/response-error';

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        // validation
        const inputValidated = Validation.validate(UserValidation.REGISTER, request);

        // cek if email already exists
        const totalUserWithSameEmail = await prismaClient.user.count({
            where: {
                email: inputValidated.email
            }
        });

        if (totalUserWithSameEmail) {
            throw new ResponseError(400, 'Email already exists');
        }

        // 
    } 
}