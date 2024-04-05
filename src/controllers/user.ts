import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../utils/types';
import User from '../models/user';
import { WrongDataError } from '../utils/error';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ users }))
  .catch(next);

export const getMe = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req?.user?._id;

  return User.findById(id)
    .then((user) => res.send({ user }))
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => User.findById(
  req.params.userId,
)
  .then((user) => res.send({ user }))
  .catch(next);

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!password || email) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!name || !about) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({ user });
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!avatar) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({ user });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;

  return User.loginUser(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
