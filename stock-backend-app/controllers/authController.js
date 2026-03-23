import { loginUser } from '../services/authServices.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await loginUser(email, password);

    res.json(data);
  } catch (err) {
    if (err.message === 'USER_NOT_FOUND') {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (err.message === 'INVALID_PASSWORD') {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    res.status(500).json({ error: 'Erro interno' });
  }
};
