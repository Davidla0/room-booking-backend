import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
