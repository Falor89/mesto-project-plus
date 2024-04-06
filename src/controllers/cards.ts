import { Response, Request, NextFunction } from 'express';
import { STATUS_OK, STATUS_CREATED } from '../utils/status-codes';
import { RequestCustom } from '../utils/types';
import Card from '../models/card';
import { WrongDataError, NotFoundError, ForbiddenError } from '../utils/error';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => { res.status(STATUS_OK).send({ cards }); })
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner: id })
    .then((card) => {
      if (!name || !link) {
        throw new WrongDataError('Переданы не все данные');
      }
      res.status(STATUS_CREATED).send({ card });
    })
    .catch(next);
};

export const deleteCardById = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  const userId = req.user?._id;

  return Card.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (String(card?.owner) !== userId) {
        throw new ForbiddenError('Это не ваша карточка');
      }
      card?.delete();
      res.status(STATUS_OK).send(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;

  return Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: id },
  }, {
    new: true,
  })
    .then((card) => res.status(STATUS_CREATED).send({ card }))
    .catch(next);
};

export const dislikeCard = (req: any, res: Response, next: NextFunction) => {
  const id = req.user._id;

  return Card.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: id },
  }, {
    new: true,
  })
    .then((card) => res.status(STATUS_OK).send({ card }))
    .catch(next);
};
