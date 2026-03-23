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

router.get('/users', getUsers);
router.get('/users/filter', authMiddleware, getUsersFiltered);
router.post('/users', createUser);
router.delete('/users', deleteUser);
router.put('/users', authMiddleware, updateUser);

export default router;
