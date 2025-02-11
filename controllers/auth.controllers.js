import bcrypt from 'bcryptjs';
import AuthModel from '../models/auth.models.js';
import { generateWebToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export const signUp = async (req, res) => {
    try {
        const { username, password, emailId } = req.body;
        if (!username || !password || !emailId) {
            return res.status(400).json({ message: "Please provide all required details." });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailId)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }
        const existingUser = await AuthModel.findOne({ $or: [{ username }, { emailId }] });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new AuthModel({ username, password: hashedPassword, emailId });
        await newUser.save();
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Error occurred during sign-up:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Please provide both username and password." });
        }
        const user = await AuthModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please sign up." });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }
        generateWebToken(user._id,res)
        res.status(200).json({ message: "Successfully signed in." });
    } catch (error) {
        console.error("Error occurred during sign-in:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const me = (req,res)=>{
    try {
        res.send(`<h1>Welcome ${req.user.username}</h1>`)
    } catch (error) {
        console.error("Error occurred during me:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}

export const forgotPasswordRequest = async (req,res)=>{
    try {
        const {email} = req.body;
        const user = await AuthModel.findOne({emailId:email});
        const secret = process.env.JWT_KEY + user.password;
        const token = jwt.sign({id:user._id,username:user.username},secret,{expiresIn:'1m'});
        const resetUrl = `http://127.0.0.1:5000/api/auth/forgotPassword/${user._id}/${token}`
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:{
                user:`${process.env.EMAIL}`,
                pass:`${process.env.PASS}`
            }
        })
        const msgOptions = {
            from: process.env.EMAIL,
            to: user.emailId,
            subject: 'Password Reset Request',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          };
        await transporter.sendMail(msgOptions,(err,info)=>{
            if (err) {
                console.log(err);
                return;
            }
            res.status(200).json({ message: `Password reset link sent`});
            transporter.close();

        })
        
    } catch (error) {
        console.error("Error occurred during ForogtPasswordRequest Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const updatePassowrd = async(req,res)=>{
    try {
        const {id,token} = req.params;
        const { newPassword } = req.body;
        const user = await AuthModel.findOne({_id:id})
        const secret = process.env.JWT_KEY + user.password
        try {
            jwt.verify(token,secret)
        } catch (error) {
            return res.status(404).json({message:"Invalid Token"})
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save()
        res.status(200).json({message:"Password Successfully Changed"})
        
    } catch (error) {
        console.error("Error occurred during ForgotPasswordRequest:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}


