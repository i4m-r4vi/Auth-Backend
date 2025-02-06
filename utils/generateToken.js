import jwt from 'jsonwebtoken'

export const generateWebToken = async(userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_KEY,{
        "expiresIn":"15d"
    })
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly : true,
        sameSite : "None",
        secure :true
    })
}