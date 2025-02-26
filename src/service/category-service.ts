import { Category, Prisma } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
    CategoryResponse,
    CreateCategoryRequest,
    SearchCategoryRequest,
    toCategoryResponse,
    UpdateCategoryRequest,
} from "../model/category-model";
import { CategoryValidation } from "../validation/category-validation";
import { Validation } from "../validation/validation";

export class CategoryService {
    static async search(
        req: SearchCategoryRequest
    ): Promise<Array<CategoryResponse>> {
        const validated = Validation.validate(CategoryValidation.SEARCH, req);
        const filters: Prisma.CategoryWhereInput = validated.name
            ? {
                  name: {
                      contains: validated.name,
                      mode: "insensitive", // Case insensitive
                  },
              }
            : {};

        const categories = await prismaClient.category.findMany({
            where: filters,
        });

        return categories.map((category) => toCategoryResponse(category));
    }

    static async store(req: CreateCategoryRequest): Promise<CategoryResponse> {
        const validated = Validation.validate(CategoryValidation.CREATE, req);

        const existingCategory = await prismaClient.category.findFirst({
            where: {
                name: {
                    contains: validated.name,
                    mode: "insensitive"
                },
            },
        });

        if (existingCategory) {
            throw new ResponseError(400, "Category already exists");
        }

        const newCategory = await prismaClient.category.create({
            data: {
                name: validated.name,
            },
        });
        return toCategoryResponse(newCategory);
    }

    static async checkIfCategoryExists(id: string): Promise<Category> {
        const existingCategory = await prismaClient.category.findFirst({
            where: {
                id: id,
            },
        });

        if (!existingCategory) {
            throw new ResponseError(404, "Category not found");
        }

        return existingCategory;
    }

    static async update(req: UpdateCategoryRequest): Promise<CategoryResponse> {
        const validated = Validation.validate(CategoryValidation.UPDATE, req);

        // chek if category exists
        await this.checkIfCategoryExists(validated.id);

        const updatedCategory = await prismaClient.category.update({
            where: {
                id: validated.id,
            },
            data: {
                name: validated.name,
            },
        });

        return toCategoryResponse(updatedCategory);
    }

    static async destroy(id: string): Promise<CategoryResponse> {
        // check if category exists
        await this.checkIfCategoryExists(id);

        // if category used by post, throw error
        const posts_count = await prismaClient.post.count({
            where: {
                categoryId: id,
            },
        });

        if (posts_count > 0) {
            throw new ResponseError(400, "Category is used by post");
        }

        const category = await prismaClient.category.delete({
            where: {
                id: id,
            },
        });

        return toCategoryResponse(category);
    }
}
