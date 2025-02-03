import bcrypt from 'bcryptjs';
import AuthModel from '../models/auth.models.js';

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
        res.status(200).json({ message: "Successfully signed in." });
    } catch (error) {
        console.error("Error occurred during sign-in:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
