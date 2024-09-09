const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getPrinterCounts } = require('../controllers/druckerStändeController')
const { getPrinterToner } = require('../controllers/druckerTonerController')

router.get('/printercounts', authenticateToken, getPrinterCounts);
router.get('/printertoner', authenticateToken, getPrinterToner);

module.exports = router;
