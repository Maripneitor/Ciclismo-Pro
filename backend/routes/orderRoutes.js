const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Ruta para crear un nuevo pedido
router.post('/', protect, createOrder);

// Ruta para obtener los pedidos del usuario
router.get('/my-orders', protect, getMyOrders);

module.exports = router;