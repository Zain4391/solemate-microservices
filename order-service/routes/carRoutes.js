/**
 * @fileoverview Cart Routes defines API endpoints for cart operations
 * @module routes/cartRoutes
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem } from '../controllers/cartController.js';
import { authMiddleware } from '../middleware/VerifyAdmin.js';

const cartRouter = express.Router();

cartRouter.get('/:userId', authMiddleware, getCart);
cartRouter.post('/', authMiddleware, addToCart);
cartRouter.put('/:cartId', authMiddleware, updateCartItem);
cartRouter.delete('/:cartId', authMiddleware, removeFromCart);

export default cartRouter;