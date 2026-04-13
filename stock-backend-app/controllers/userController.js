import userService from '../services/userServices.js';

const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersFiltered = async (req, res) => {
  try {
    const filters = req.query;
    console.log(filters);
    const users = await userService.getUsersFiltered(filters);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, color, birth } = req.body;

    const user = await userService.createUser(
      name,
      email,
      password,
      color,
      birth,
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await userService.deleteUser(id);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, name, email, color, birth } = req.body;

    const user = await userService.updateUser(id, { name, email, color, birth });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getUsers, getUsersFiltered, createUser, deleteUser, updateUser };
