// backend/config/index.js
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET no está definida en las variables de entorno.');
  process.exit(1);
}

// Validar otras variables críticas si es necesario (DB settings, etc.)

module.exports = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
  // Centralizamos la config de DB aquí también si lo deseas en el futuro
};