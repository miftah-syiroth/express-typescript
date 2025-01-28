import { Category } from "@prisma/client";

export type CreateCategoryRequest = {
    name: string;
};

export type UpdateCategoryRequest = {
    id: string;
    name: string;
};

export type SearchCategoryRequest = {
    name?: string;
};

export type CategoryResponse = {
    id: string;
    name: string;
}

export function toCategoryResponse(category: Category): CategoryResponse {
    return {
        id: category.id,
        name: category.name
    }
}