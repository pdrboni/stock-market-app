import express from 'express';
import {
  getUsers,
  getUsersFiltered,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/users', authMiddleware, getUsers);
router.get('/users/filter', authMiddleware, getUsersFiltered);
router.post('/users', createUser);
router.delete('/users', authMiddleware, deleteUser);
router.put('/users', authMiddleware, updateUser);

export default router;
