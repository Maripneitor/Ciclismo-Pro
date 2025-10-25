const express = require('express');
const router = express.Router();
const { 
  getMyTeams, 
  getTeamById, 
  createTeam,
  generateInviteLink,
  joinTeam
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-teams', protect, getMyTeams);
router.post('/', protect, createTeam);
router.post('/join', protect, joinTeam); // Esta ruta debe ir ANTES de las rutas con :id
router.get('/:id', protect, getTeamById);
router.post('/:id/generate-invite', protect, generateInviteLink);

module.exports = router;