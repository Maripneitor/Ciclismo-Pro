const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const config = require('../config');

const registerUser = async (req, res, next) => {
  const { nombre_completo, correo_electronico, contrasena } = req.body;

  console.log('=== REGISTER DEBUG ===');
  console.log('Request body:', req.body);

  const existingUser = await db.query(
    'SELECT * FROM usuarios WHERE correo_electronico = $1',
    [correo_electronico]
  );

  console.log('Existing user check:', existingUser.rows);

  if (existingUser.rows.length > 0) {
    const error = new Error('El correo electrónico ya está registrado');
    error.statusCode = 400;
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(contrasena, 10);
  console.log('Password hashed successfully');

  const newUser = await db.query(
    'INSERT INTO usuarios (nombre_completo, correo_electronico, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario, rol',
    [nombre_completo, correo_electronico, hashedPassword, 'usuario']
  );

  console.log('New user created:', newUser.rows[0]);

  const token = jwt.sign(
    { 
      id_usuario: newUser.rows[0].id_usuario,
      rol: newUser.rows[0].rol
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  console.log('JWT token generated');

  res.json({
    success: true,
    token
  });
};

const loginUser = async (req, res, next) => {
  const { correo_electronico, contrasena } = req.body;

  console.log('=== LOGIN DEBUG ===');
  console.log('Login attempt for:', correo_electronico);
  console.log('Request body:', req.body);

  const userResult = await db.query(
    'SELECT * FROM usuarios WHERE correo_electronico = $1',
    [correo_electronico]
  );

  console.log('User found:', userResult.rows.length > 0 ? 'Yes' : 'No');

  if (userResult.rows.length === 0) {
    console.log('User not found with email:', correo_electronico);
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    return next(error);
  }

  const user = userResult.rows[0];
  console.log('User found:', { id: user.id_usuario, email: user.correo_electronico });

  const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  console.log('Password valid:', isPasswordValid);

  if (!isPasswordValid) {
    console.log('Invalid password for user:', correo_electronico);
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    return next(error);
  }

  const token = jwt.sign(
    { 
      id_usuario: user.id_usuario,
      rol: user.rol
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );

  console.log('Login successful, token generated');

  res.json({
    success: true,
    token
  });
};

module.exports = {
  registerUser,
  loginUser
};