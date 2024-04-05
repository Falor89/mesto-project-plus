import { Response, Request, NextFunction } from 'express';
import { RequestCustom } from '../utils/types';
import Card from '../models/card';
import User from '../models/user';
import { WrongDataError, NotFoundError } from '../utils/error';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => { res.send({ cards }); })
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner: id })
    .then((card) => {
      if (!name || !link) {
        throw new WrongDataError('Переданы не все данные');
      }
      res.send({ card });
    })
    .catch(next);
};

export const deleteCardById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.cardId;

  return Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      card?.delete();
      res.send(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  User.findById(id)
    .catch(() => {
      const error = new WrongDataError('Передан неверный пользователь');
      res.status(error.status).send(error.message);
    });

  return Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: id },
  }, {
    new: true,
  })
    .then((card) => res.send({ card }))
    .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  User.findById(id)
    .catch(() => {
      const error = new WrongDataError('Передан неверный пользователь');
      res.status(error.status).send(error.message);
    });

  return Card.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: id },
  }, {
    new: true,
  })
    .then((card) => res.send({ card }))
    .catch(next);
};
