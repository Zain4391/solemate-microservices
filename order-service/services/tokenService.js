/**
 * @fileoverview tokenService is a service that decodes JWT tokens.
 * @module services/tokenService
 * @author Zain
 * @version 1.0.0
 * @since 1.0.0
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class tokenService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
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

export default new tokenService();