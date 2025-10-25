const express = require('express');
const router = express.Router();
const { getAllShirtSizes } = require('../controllers/dataController');

router.get('/tallas-playera', getAllShirtSizes);

module.exports = router;