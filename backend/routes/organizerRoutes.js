const express = require('express');
const router = express.Router();
const { 
  getOrganizerData,
  getMyCreatedEvents,
  getEventParticipants,
  createEvent // Se asume que esta función existe en el controlador
} = require('../controllers/organizerController');
const { protect, isOrganizer } = require('../middleware/authMiddleware');

// Ruta protegida solo para organizadores y administradores
router.get('/dashboard-data', protect, isOrganizer, getOrganizerData);
router.get('/my-events', protect, isOrganizer, getMyCreatedEvents);
router.get('/my-events/:id/participants', protect, isOrganizer, getEventParticipants);

// Ruta POST para crear un nuevo evento (Añadida para manejar la petición del frontend)
router.post('/my-events', protect, isOrganizer, createEvent);

module.exports = router;