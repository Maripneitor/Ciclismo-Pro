const express = require('express');
const router = express.Router();
const { getPublicProducts } = require('../controllers/productController');

// Ruta pública para obtener productos activos
router.get('/', getPublicProducts);

module.exports = router;