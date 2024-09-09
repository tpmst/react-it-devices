const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { updateCsv, downloadCsv, updateCsvKlein } = require('../controllers/csvController');

router.post('/update-csv/:filename', authenticateToken, updateCsv);
router.post('/update-csv-klein/:filename', authenticateToken, updateCsvKlein);
router.get('/download-csv/:filename', authenticateToken, downloadCsv);

module.exports = router;
