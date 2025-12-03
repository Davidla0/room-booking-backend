"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.meController = meController;
const auth_service_1 = require("../services/auth.service");
async function registerController(req, res) {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'email, password and fullName are required'
            });
        }
        const user = await (0, auth_service_1.registerUser)({ email, password, fullName });
        return res.status(201).json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            createdAt: user.createdAt
        });
    }
    catch (err) {
        if (err.code === 'EMAIL_EXISTS') {
            return res.status(409).json({
                error: 'EMAIL_ALREADY_EXISTS',
                message: 'A user with this email already exists'
            });
        }
        console.error('registerController error:', err);
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: 'email and password are required'
            });
        }
        const loginResult = await (0, auth_service_1.loginUser)({ email, password });
        return res.status(200).json(loginResult);
    }
    catch (err) {
        if (err.code === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                error: 'INVALID_CREDENTIALS',
                message: 'Email or password is incorrect'
            });
        }
        console.error('loginController error:', err);
        return res.status(500).json({
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
}
async function meController(req, res) {
    if (!req.user) {
        return res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'User not found in request'
        });
    }
    return res.status(200).json({
        id: req.user.id,
        email: req.user.email
    });
}
