import express from 'express'
import { signIn, signUp,me } from '../controllers/auth.controllers.js';
import { protectedRoutes } from '../middleware/protectedRoutes.js';
const AuthRoutes = express.Router();

AuthRoutes.post('/signup',signUp);
AuthRoutes.post('/signin',signIn);
AuthRoutes.get('/me',protectedRoutes,me)

export default AuthRoutes