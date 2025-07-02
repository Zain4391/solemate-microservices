/**
 * @fileoverview TokenService is a service that carries out user authentication and password hashing.
 * @module services/AuthService
 * @author Zain
 * @version 1.0.2
 * @since 1.0.0
 */

import supabase from '../config/Database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import TokenService from './TokenService.js';

dotenv.config();

class AuthService {
    async hashpassword(password) {
        const salt = parseInt(process.env.BCRYPT_ROUNDS) || 12;

        if(!salt) {
            throw new Error("Missing environment variable");
        }
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    async signIn(userData) {
        const { email, password, isAdmin } = userData;
        // check for email in DB
        try {
            const { data, error } = await supabase.from("Users").select().eq("email", email).is('deleted_at', null);
            if(data && data.length > 0) {
                throw new Error("Email in use");
            }
            if(error) {
                throw new Error(error.message);
            }
            const hash = await this.hashpassword(password);
            const userId = uuidv4();
            const insertData = {
                ...userData,
                password: hash,
                u_id: userId
            }
            const insertError = await supabase.from("Users").insert(insertData);
            if(insertError.error) {
                throw new Error(insertError.error.message);
            }
            const returnData = {
                ...userData,
                password: null
            }
            const token = await TokenService.generateToken(userId, email, isAdmin);
            return {
                message: "User Generated successfully",
                user: returnData,
                token
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const { data, error } = await supabase.from("Users").select().eq("email", email);
            if(data.length === 0) {
                throw new Error("Invalid email or password");
            }
            if(error) {
                throw new Error(error.message);
            }

            const user = data[0];
            if(await bcrypt.compare(password, user.password)) {
                const token = await TokenService.generateToken(user.u_id, user.email, user.is_admin);
                return {
                    message: "Login successful",
                    user: {
                        userId: user.u_id,
                        email: user.email,
                        isAdmin: user.is_admin
                    },
                    token
                }
            }
            else {
                throw new Error("Login failed, check your credentials");
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async resetPassword(email, newPassword) {
        try {
            const { data, error } = await supabase.from("Users").select().eq("email", email).is('deleted_at', null);
            if(data.length === 0) {
                throw new Error("User not found");
            }
            if(error) {
                throw new Error(error.message);
            }
            const hash = await this.hashpassword(newPassword);
            const user = data[0];

            const updData = {
                password: hash
            }

            const { error: updError } = await supabase.from("Users").update(updData).eq('u_id', user.u_id);

            if(updError) {
                throw new Error(updError.message);
            }
            return {
                message: "Password reset successful!"
            }
        } catch (error) {
            console.log(error);
            throw error;
        }   
    }
}

export default new AuthService();