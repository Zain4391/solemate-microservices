/**
 * @fileoverview authController is a controller that carries out request parsing and response handling.
 * @module services/AuthService
 * @author Zain
 * @version 1.0.2
 * @since 1.0.0
 */

import AuthService from "../services/AuthService.js";

export const register = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    if(!firstName || !lastName || !email || !password || !phoneNumber) {
        return res.status(400).json({message: 'Bad request, all fields required', success: false});
    }

    const userData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        is_admin: 'N'
    }
    try {
        const result = await AuthService.signIn(userData);
        return res.status(201).json({
            message:'User registered successfully',
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({message: 'Bad Request, all fields required', success: false});
    }

    try {
        const result = await AuthService.login(email, password);

        return res.status(200).json({
            message: 'Login successful',
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

export const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'Bad Request, all fields required', success: false});
    }

    try {
        const result = await AuthService.resetPassword(email, password);

        return res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
};