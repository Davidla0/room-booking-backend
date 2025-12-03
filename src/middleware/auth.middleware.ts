
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/common.types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing Authorization header'
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid Authorization header format'
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      id: payload.sub,
      email: payload.email
    };

    return next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Invalid or expired token'
    });
  }
}
