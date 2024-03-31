import mongoose from 'mongoose';

type TUser = {
    name: string;
    about: string;
    avatar: string;
}

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
});

export default mongoose.model<TUser>('user', userSchema);
