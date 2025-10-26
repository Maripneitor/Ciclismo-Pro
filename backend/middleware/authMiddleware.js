const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token no proporcionado'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido'
    });
  }
};

const isOrganizer = (req, res, next) => {
  try {
    // Verificar que el usuario esté autenticado (debería venir de protect)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario no autenticado'
      });
    }

    // Verificar que tenga rol de organizador o administrador
    if (req.user.rol !== 'organizador' && req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado. Se requiere rol de organizador o administrador.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al verificar rol'
    });
  }
};

module.exports = { protect, isOrganizer };