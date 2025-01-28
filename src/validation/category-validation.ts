import { z, ZodType } from "zod";

export class CategoryValidation {
    static readonly CREATE: ZodType = z.object({
        name: z.string().min(3).max(255),
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.string().min(3).max(255),
        name: z.string().min(3).max(255),
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(3).max(255).optional()
    });
}