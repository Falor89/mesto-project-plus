import Router from 'express';
import {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

export default router;
