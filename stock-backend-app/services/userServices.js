import * as userModel from '../models/userModel.js';
import { hashPassword } from '../utils/hashPassowrd.js';

const createUser = async (name, email, password) => {
  const passwordHash = await hashPassword(password);
  console.log(passwordHash);

  return userModel.createUser(name, email, passwordHash);
};

const getUsers = async () => {
  return userModel.getUsers();
};

const getUsersFiltered = async (filters) => {
  return userModel.getUsersFiltered(filters);
};

const deleteUser = async (id) => {
  const user = await userModel.deleteUser(id);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// TODO validar email, impedir alteração de senha, verificar duplicidade
const updateUser = async (id, name, email) => {
  const user = await userModel.updateUser(id, name, email);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export default {
  createUser,
  getUsers,
  getUsersFiltered,
  deleteUser,
  updateUser,
};
