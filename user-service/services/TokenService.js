/**
 * @fileoverview TokenService is a service that generates, verifies and decodes JWT tokens.
 * @module services/TokenService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class TokenService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    }

    async generateToken(userId, email, isAdmin) {
        const payload = {userId, email, isAdmin};
        const token = jwt.sign(payload, this.jwtSecret, {expiresIn: this.jwtExpiresIn});
        return token;
    }

    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            return decoded;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expired');
              } else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
            throw new Error('Invalid token');
        }
    }

    async decodeToken(token) {
        const decoded = jwt.decode(token);
        return decoded;
    }
        
}

export default new TokenService();



