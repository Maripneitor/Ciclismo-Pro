const jwt = require('jsonwebtoken');
const config = require('../config');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('No autorizado - Token no proporcionado');
    error.statusCode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = 'No autorizado - Token inválido';
    next(error);
  }
};

const isOrganizer = (req, res, next) => {
  // Verificar que el usuario esté autenticado (debería venir de protect)
  if (!req.user) {
    const error = new Error('No autorizado - Usuario no autenticado');
    error.statusCode = 401;
    return next(error);
  }

  // Verificar que tenga rol de organizador o administrador
  if (req.user.rol !== 'organizador' && req.user.rol !== 'administrador') {
    const error = new Error('Acceso denegado. Se requiere rol de organizador o administrador.');
    error.statusCode = 403;
    return next(error);
  }

  next();
};

const isAdmin = (req, res, next) => {
  // Verificar que el usuario esté autenticado (debería venir de protect)
  if (!req.user) {
    const error = new Error('No autorizado - Usuario no autenticado');
    error.statusCode = 401;
    return next(error);
  }

  // Verificar que tenga rol de administrador (EXCLUSIVAMENTE administrador)
  if (req.user.rol !== 'administrador') {
    const error = new Error('Acceso denegado. Se requiere rol de administrador.');
    error.statusCode = 403;
    return next(error);
  }

  next();
};

module.exports = { protect, isOrganizer, isAdmin };