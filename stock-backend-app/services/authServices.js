import { comparePassword } from '../utils/comparePassword.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/database.js';

dotenv.config();

export const loginUser = async (email, password) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  console.log(user);
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    throw new Error('INVALID_PASSWORD');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  return { token, user };
};
