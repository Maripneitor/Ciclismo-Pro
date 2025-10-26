// backend/controllers/passwordController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const forgotPassword = async (req, res) => {
  try {
    const { correo_electronico } = req.body;

    if (!correo_electronico) {
      return res.status(400).json({ 
        success: false, 
        message: 'El correo electrónico es requerido' 
      });
    }

    // Buscar usuario por email
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE correo_electronico = $1',
      [correo_electronico]
    );

    // Por seguridad, siempre devolvemos éxito incluso si el email no existe
    if (userResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Si tu correo existe, recibirás un enlace de recuperación'
      });
    }

    const user = userResult.rows[0];

    // Generar token de reseteo
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Establecer expiración (10 minutos)
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    // Guardar token hasheado y expiración en la BD
    await pool.query(
      'UPDATE usuarios SET reset_password_token = $1, reset_password_expires = $2 WHERE id_usuario = $3',
      [hashedToken, expires, user.id_usuario]
    );

    // SIMULACIÓN DE ENVÍO DE EMAIL
    console.log('=========================================');
    console.log('📧 SIMULACIÓN DE EMAIL DE RECUPERACIÓN');
    console.log('=========================================');
    console.log(`Para: ${correo_electronico}`);
    console.log(`Token de recuperación: ${resetToken}`);
    console.log(`Enlace: http://localhost:5173/reset-password/${resetToken}`);
    console.log('Este token expira en 10 minutos');
    console.log('=========================================');

    res.status(200).json({
      success: true,
      message: 'Si tu correo existe, recibirás un enlace de recuperación'
    });

  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContrasena } = req.body;

    if (!nuevaContrasena) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña es requerida'
      });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Hashear el token recibido para comparar con el de la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Token no válido o expirado'
      });
    }

    const user = userResult.rows[0];

    // Hashear la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);

    // Actualizar contraseña y limpiar token
    await pool.query(
      'UPDATE usuarios SET contrasena = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id_usuario = $2',
      [hashedPassword, user.id_usuario]
    );

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  forgotPassword,
  resetPassword
};