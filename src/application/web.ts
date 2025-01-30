import express from "express";
import cors from "cors";
import { publicRouter } from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {apiRouter} from "../route/api";
import { UserController } from "../controller/user-controller";
import cookieParser from "cookie-parser";

export const web = express();

web.use(
    cors({
        origin: [
            "http://localhost:3000"
        ],
        credentials: true, // Ini penting agar cookies dikirim
    })
);
web.use(cookieParser());
web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.use(publicRouter);

web.post("/api/refresh", UserController.refresh);

web.use(apiRouter);

web.use(errorMiddleware);
