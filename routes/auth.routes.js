import express from 'express'
import { signIn, signUp } from '../controllers/auth.controllers.js';
const AuthRoutes = express.Router();

AuthRoutes.post('/signup',signUp);
AuthRoutes.post('/signin',signIn)

export default AuthRoutes