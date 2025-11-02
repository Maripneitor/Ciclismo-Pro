const express = require('express');
const router = express.Router();
const { 
  getDashboardData, // <-- AÑADE ESTA LÍNEA
  getAllUsers, 
  getAllEvents, 
  updateUserRole, 
  updateEventStatus,
  toggleFeaturedEvent,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- AÑADE ESTA NUEVA RUTA ---
router.get('/dashboard-data', protect, isAdmin, getDashboardData);
// -----------------------------

// Rutas protegidas solo para administradores
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/events', protect, isAdmin, getAllEvents);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
router.put('/events/:id/status', protect, isAdmin, updateEventStatus);
router.put('/events/:id/feature', protect, isAdmin, toggleFeaturedEvent);

// Rutas de gestión de productos
router.get('/products', protect, isAdmin, getAllProducts);
router.post('/products', protect, isAdmin, createProduct);
router.get('/products/:id', protect, isAdmin, getProductById);
router.put('/products/:id', protect, isAdmin, updateProduct);

// Rutas de gestión de pedidos
router.get('/orders', protect, isAdmin, getAllOrders);
router.put('/orders/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;