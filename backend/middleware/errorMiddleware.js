// backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  // Log del error para el servidor (puedes mejorarlo con librerías como Winston luego)
  console.error('Error capturado por middleware:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message: message,
    // Solo enviamos el stack trace en desarrollo por seguridad
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;