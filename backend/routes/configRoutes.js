const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { updateSettings, getSettings } = require('../controllers/configController');

router.post('/updateConfig', authenticateToken, updateSettings);
router.get('/getConfig', authenticateToken, getSettings);

module.exports = router;
