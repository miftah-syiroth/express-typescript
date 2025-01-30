// import jwt from "jsonwebtoken";
// import CONFIG from "./config";

// // expiresIn: harus number atau string '1d'.
// export const generateAccessToken = (payload: object) => {
//     return jwt.sign(payload, CONFIG.JWT.SECRET, {
//         expiresIn: "1d",
//     });
// };

// export const generateRefreshToken = (payload: object) => {
//     return jwt.sign(payload, CONFIG.JWT.REFRESH_SECRET, {
//         expiresIn: "7d",
//     });
// };

// export const verifyToken = (token: string, secret: string) => {
//     jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         (err, decoded) => {
//             if (err || foundUser.username !== decoded.username)
//                 return res.sendStatus(403);
//             const accessToken = jwt.sign(
//                 { username: decoded.username },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: "30s" }
//             );
//             res.json({ accessToken });
//         }
//     );
// };
