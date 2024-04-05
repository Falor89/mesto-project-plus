import { NextFunction, Request, Response } from 'express';
import { ALREADY_ERROR_STATUS, WRONG_DATA_ERROR_STATUS } from '../utils/error';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.name === 'ValidationError') {
    res.status(WRONG_DATA_ERROR_STATUS).send({ message: 'Переданы неверные данные' });
  } else if (err?.name === 'CastError') {
    res.status(WRONG_DATA_ERROR_STATUS).send({ message: 'Запрашиваемые данные не найдены' });
  } else if (err.code === 11000) {
    res.status(ALREADY_ERROR_STATUS).send({ message: 'Такой пользователь уже существует' });
  } else if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

export default errorMiddleware;
