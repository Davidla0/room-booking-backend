
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { LoginInput, RegisterInput } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

export async function registerUser(input: RegisterInput) {
  const { email, password, fullName } = input;

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    const error: any = new Error('Email already in use');
    error.code = 'EMAIL_TAKEN';
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
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

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error: any = new Error('Invalid credentials');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    const error: any = new Error('Invalid credentials');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

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
