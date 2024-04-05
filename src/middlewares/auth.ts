import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../utils/error';
import { RequestCustom } from '../utils/types';

const authMiddleware = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Требуется авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;

  try {
    payload = (jwt.verify(token, 'secret-key')) as jwt.JwtPayload;
  } catch (error) {
    throw new AuthError('Требуется авторизация');
  }

  req.user = { _id: payload._id };
  next();
};

export default authMiddleware;
