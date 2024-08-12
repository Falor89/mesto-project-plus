import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors, celebrate, Joi } from 'celebrate';
import { NotFoundError } from './utils/error';
import userRouter from './routes/user';
import cardRouter from './routes/cards';
import { createUser, login } from './controllers/user';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorMiddleware from './middlewares/error';

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.14');

app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Указанного пути не существует'));
});

app.use(errorLogger);

app.use(errors());

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
