import express from 'express';
import { register, resetPassword } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/sign-in', register);
authRouter.post('/login', login);
authRouter.post('/reset-password', resetPassword);

export default authRouter;