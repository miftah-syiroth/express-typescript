import express from "express";
import { CategoryController } from "../controller/category-controller";
import {authMiddleware} from "../middleware/auth-middleware";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/categories", CategoryController.search);
apiRouter.post("/api/categories", CategoryController.store);
apiRouter.put("/api/categories/:categoryId", CategoryController.update);
apiRouter.delete("/api/categories/:categoryId", CategoryController.destroy);
