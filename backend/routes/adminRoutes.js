const express = require('express');
const router = express.Router();
const { getAllUsers, getAllEvents, updateUserRole } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Rutas protegidas solo para administradores
router.get('/users', protect, isAdmin, getAllUsers);
router.get('/events', protect, isAdmin, getAllEvents);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;