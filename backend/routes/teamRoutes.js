const express = require('express');
const router = express.Router();
const { getMyTeams, getTeamById, createTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-teams', protect, getMyTeams);
router.post('/', protect, createTeam);
router.get('/:id', protect, getTeamById);

module.exports = router;