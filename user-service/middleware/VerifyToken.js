/**
 * @fileoverview VerifyToken is a middleware that carries out token verification.
 * @module middleware/VerifyToken
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import TokenService from "../services/TokenService.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Invalid Token, authorization token required',
                success: false
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = await TokenService.verifyToken(token);

        if(!decoded || !decoded.userId || !decoded.email || !decoded.isAdmin) {
            return res.status(401).json({
                message: 'Invalid Token',
                success: false
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
          });
    }
  };

export const adminMiddleware = (req, res, next) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: 'Admin access required',
        success: false
      });
    }
    next();
  };