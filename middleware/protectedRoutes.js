import jwt from 'jsonwebtoken'
import AuthModel from '../models/auth.models.js';

export const protectedRoutes = async (req, res, next) => {
    const token = await req.cookies.jwt;
    if (!token) {
        return res.status(404).json({ error: "No Token" })
    }
    const decode = await jwt.verify(token, process.env.JWT_KEY);
    if (!decode) {
        return res.status(404).json({ error: "Unauthorized Invalid Token" })
    }
    const user = await AuthModel.findOne({ _id: decode.userId }).select("-password")
    if (!user) {
        return res.status(404).json({ error: "User Not Found" })
    }
    req.user = user;
    next()

}