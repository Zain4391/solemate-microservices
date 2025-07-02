import { getUserProfile, getAllUsers, getUserById, updateProfile, deleteAccount, deleteUser } from "../controllers/userController.js";
import { adminMiddleware, authMiddleware } from '../middleware/VerifyToken.js';
import express from 'express';

const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.delete('/account', authMiddleware, deleteAccount);

userRouter.get('/users', authMiddleware, adminMiddleware, getAllUsers);
userRouter.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
userRouter.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

export default userRouter;