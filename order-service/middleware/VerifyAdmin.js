/**
 * @fileoverview Admin Authentication Middleware protects admin-only routes
 * @module middleware/adminAuth
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */
import tokenService from '../services/tokenService.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Invalid token, authorization token required',
                succesS: false
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = await tokenService.verifyToken(token);

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
            message: error.message,
            success: false
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