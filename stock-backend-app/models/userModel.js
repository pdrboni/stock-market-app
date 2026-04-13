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

const createUser = async (name, email, passwordHash, color, birth) => {
  const result = await db.query(
    'INSERT INTO users (name, email, password_hash, color, birth) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, email, passwordHash, color, birth],
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [
    id,
  ]);

  return result.rows[0];
};

const updateUser = async (id, fields) => {
  const allowed = ['name', 'email', 'color', 'birth'];
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  for (const col of allowed) {
    if (fields[col] !== undefined) {
      setClauses.push(`${col} = $${paramIndex}`);
      values.push(fields[col]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    throw new Error('No fields provided for update');
  }

  values.push(id);
  const result = await db.query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values,
  );

  return result.rows[0];
};

export { getUsers, getUsersFiltered, createUser, deleteUser, updateUser };
