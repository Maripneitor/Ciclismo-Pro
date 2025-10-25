const express = require('express');
const router = express.Router();
const { getAllEvents, getEventById, getEventCategories } = require('../controllers/eventController');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/:id/categories', getEventCategories);

module.exports = router;