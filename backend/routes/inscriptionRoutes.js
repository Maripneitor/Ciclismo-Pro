const express = require('express');
const router = express.Router();
const { 
  getMyInscriptions,
  createInscription 
} = require('../controllers/inscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mis-inscripciones', protect, getMyInscriptions);
router.post('/', protect, createInscription); // NUEVA RUTA

module.exports = router;