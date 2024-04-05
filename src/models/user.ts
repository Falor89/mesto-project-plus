import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { AuthError } from '../utils/error';

type TUser = {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string
}

interface IUserModel extends mongoose.Model<TUser> {
  loginUser: (
    email: string,
    password: string
  ) => Promise<mongoose.Document<unknown, any, TUser>>
}

const userSchema = new mongoose.Schema<TUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    require: true,
    validate: {
      validator: (e: string) => validator.isEmail(e),
      message: 'Неверная почта',
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
});

userSchema.static('loginUser', function loginUser(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверный пароль или имя пользователя!');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new AuthError('Неверный пароль или имя пользователя!');
          }
          return user;
        });
    });
});

export default mongoose.model<TUser, IUserModel>('user', userSchema);
