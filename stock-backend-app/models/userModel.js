import db from '../config/database.js';

const getUsers = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

const getUsersFiltered = async (filters) => {
  let query = 'SELECT * FROM users';
  const values = [];
  const conditions = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      conditions.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const result = await db.query(query, values);
  return result.rows;
};

const createUser = async (name, email, passwordHash) => {
  const result = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [name, email, passwordHash],
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0];
};

const updateUser = async (id, name, email) => {
  const result = await db.query(
    `UPDATE users
     SET name = $1, email = $2
     WHERE id = $3
     RETURNING *`,
    [name, email, id],
  );

  return result.rows[0];
};

export { getUsers, getUsersFiltered, createUser, deleteUser, updateUser };
