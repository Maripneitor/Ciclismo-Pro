const express = require('express');
const router = express.Router();
const { 
  getOrganizerData,
  getMyCreatedEvents,
  getEventParticipants
} = require('../controllers/organizerController');
const { protect, isOrganizer } = require('../middleware/authMiddleware');

// Ruta protegida solo para organizadores y administradores
router.get('/dashboard-data', protect, isOrganizer, getOrganizerData);
router.get('/my-events', protect, isOrganizer, getMyCreatedEvents);
router.get('/my-events/:id/participants', protect, isOrganizer, getEventParticipants);

module.exports = router;