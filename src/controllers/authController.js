const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

const registro = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const usuarioExiste = await pool.query(
      'SELECT * FROM organizadores WHERE email = $1',
      [email]
    );

    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = await pool.query(
      'INSERT INTO organizadores (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, passwordEncriptada]
    );

    res.status(201).json({ mensaje: 'Usuario creado', usuario: nuevoUsuario.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await pool.query(
      'SELECT * FROM organizadores WHERE email = $1',
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.rows[0].password);

    if (!passwordValida) {
      return res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.rows[0].id, email: usuario.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ mensaje: 'Login exitoso', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { registro, login };