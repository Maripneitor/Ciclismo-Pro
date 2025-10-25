const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const registerUser = async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, contrasena } = req.body;

    console.log('=== REGISTER DEBUG ===');
    console.log('Request body:', req.body);

    const existingUser = await db.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );

    console.log('Existing user check:', existingUser.rows);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
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
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log('JWT token generated');

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
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
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = userResult.rows[0];
    console.log('User found:', { id: user.id_usuario, email: user.correo_electronico });

    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', correo_electronico);
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { 
        id_usuario: user.id_usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    console.log('Login successful, token generated');

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};