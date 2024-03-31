import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { RequestCustom } from './utils/types';
import userRouter from './routes/user';
import cardRouter from './routes/cards';

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next) => {
  (req as RequestCustom).user = {
    _id: '66096e1413f80b02e1d7ca27',
  };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
