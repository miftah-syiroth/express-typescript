import { NextFunction, Request, Response } from "express";
import { CreateCategoryRequest, SearchCategoryRequest, UpdateCategoryRequest } from "../model/category-model";
import { CategoryService } from "../service/category-service";

export class CategoryController{
    static async search(req: Request, res: Response, next: NextFunction){
        try {
            const request: SearchCategoryRequest = req.body as SearchCategoryRequest;
            const response = await CategoryService.search(request);
            res.status(200).json({
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async store(req: Request, res: Response, next: NextFunction){
        try {
            const request: CreateCategoryRequest = req.body as CreateCategoryRequest;
            const response = await CategoryService.store(request);
            res.status(200).json({
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction){
        try {
            const request: UpdateCategoryRequest = req.body as UpdateCategoryRequest;
            request.id = req.params.categoryId;

            const response = await CategoryService.update(request);
            res.status(200).json({
                data: response
            });
        } catch (error) {
            next(error);
        }
    }

    static async destroy(req: Request, res: Response, next: NextFunction){
        try {
            const categoryId = req.params.categoryId;
            await CategoryService.destroy(categoryId);
            res.status(200).json({
                data: "OK"
            });
        } catch (error) {
            next(error);
        }
    }
}