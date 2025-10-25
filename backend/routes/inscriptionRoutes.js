const express = require('express');
const router = express.Router();
const { getMyInscriptions } = require('../controllers/inscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mis-inscripciones', protect, getMyInscriptions);

module.exports = router;