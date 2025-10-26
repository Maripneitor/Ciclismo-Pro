const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getAllEvents, 
  updateUserRole, 
  updateEventStatus,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas solo para administradores
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/events', protect, isAdmin, getAllEvents);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);
router.put('/events/:id/status', protect, isAdmin, updateEventStatus);

// Rutas de gestión de productos
router.get('/products', protect, isAdmin, getAllProducts);
router.post('/products', protect, isAdmin, createProduct);
router.get('/products/:id', protect, isAdmin, getProductById);
router.put('/products/:id', protect, isAdmin, updateProduct);

module.exports = router;