import jwt from "jsonwebtoken";
import CONFIG from "./config";

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, CONFIG.JWT.SECRET, {
        expiresIn: "1d",
    });
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, CONFIG.JWT.REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, CONFIG.JWT.SECRET);
    } catch (error) {
        return null;
    }
};
