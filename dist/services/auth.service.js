"use strict";
// src/services/auth.service.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
async function registerUser(input) {
    const { email, password, fullName } = input;
    const existing = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (existing) {
        const error = new Error('Email already in use');
        error.code = 'EMAIL_TAKEN';
        throw error;
    }
    const passwordHash = await bcrypt_1.default.hash(password, BCRYPT_ROUNDS);
    const user = await prisma_1.prisma.user.create({
        data: {
            email,
            fullName,
            passwordHash,
        },
    });
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
    };
}
async function loginUser(input) {
    const { email, password } = input;
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }
    const isValid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isValid) {
        const error = new Error('Invalid credentials');
        error.code = 'INVALID_CREDENTIALS';
        throw error;
    }
    const accessToken = jsonwebtoken_1.default.sign({
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
    }, JWT_SECRET, { expiresIn: '1h' });
    return {
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        },
    };
}
