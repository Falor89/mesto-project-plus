import { Response, Request } from 'express';
import { RequestCustom } from '../utils/types';
import Card from '../models/card';
import User from '../models/user';
import { SERVER_ERROR_STATUS, WRONG_DATA_ERROR } from '../utils/error';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => { res.send({ cards }); })
  .catch(() => {
    res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
  });

export const createCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner: id })
    .then((card) => {
      if (!name || !link) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name || err.name === 'ValidationError') {
        res.status(WRONG_DATA_ERROR.status).send(err.message);
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  const id = req.params.cardId;

  return Card.findByIdAndDelete(id)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(WRONG_DATA_ERROR.status).send('Запрашиваемая карточка не найдена');
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const likeCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  User.findById(id)
    .catch(() => {
      res.status(400).send('Передан неверный пользователь');
    });

  return Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: id },
  }, {
    new: true,
  })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(WRONG_DATA_ERROR.status).send('Запрашиваемая карточка не найдена');
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const dislikeCard = (req: any, res: Response) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: userId },
    },
    { new: true },
  )
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(WRONG_DATA_ERROR.status).send('Запрашиваемая карточка не найдена');
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};
