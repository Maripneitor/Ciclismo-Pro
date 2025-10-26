const express = require('express');
const router = express.Router();
const { updateInscriptionStatus } = require('../controllers/inscriptionAdminController');
const { protect, isOrganizer } = require('../middleware/authMiddleware');

// Ruta protegida solo para organizadores y administradores
router.put('/:id/status', protect, isOrganizer, updateInscriptionStatus);

module.exports = router;