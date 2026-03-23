import { loginUser } from '../services/authServices.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await loginUser(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true em produção (HTTPS)
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });

    res.json({ user });
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
