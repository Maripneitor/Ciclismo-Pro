const express = require('express');
const router = express.Router();
const { 
  getOrganizerData,
  getMyCreatedEvents 
} = require('../controllers/organizerController');
const { protect, isOrganizer } = require('../middleware/authMiddleware');

// Ruta protegida solo para organizadores y administradores
router.get('/dashboard-data', protect, isOrganizer, getOrganizerData);
router.get('/my-events', protect, isOrganizer, getMyCreatedEvents); // NUEVA RUTA

module.exports = router;