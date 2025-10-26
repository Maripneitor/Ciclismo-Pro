const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getFeaturedEvents, 
  getEventById, 
  getEventCategories 
} = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/featured', getFeaturedEvents);
router.get('/:id', getEventById);
router.get('/:id/categories', getEventCategories);

module.exports = router;