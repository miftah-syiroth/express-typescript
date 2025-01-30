import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
    ENV: process.env.ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    JWT: {
        SECRET: process.env.JWT_SECRET || "secret",
        REFRESH_SECRET: process.env.JWT_REFRESH_SCREET || "refresh_secret",
        EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    COOKIE: {
        NAME: process.env.COOKIE_NAME || "refresh_token",
        DOMAIN: process.env.COOKIE_DOMAIN || "localhost",
    },
    STORAGE_URL: process.env.STORAGE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
};

export default CONFIG;
