const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const {downloadFileRechnungen, uploadFileEinkauf, uploadRechnungen, uploadInvest, uploadFileEinkaufInvest, downloadFileInvest} = require('../controllers/einkaufController')
router.get('/download-rechnungen/:filename', authenticateToken, downloadFileRechnungen);
router.post('/upload-rechnungen', authenticateToken, uploadRechnungen.single('file'), uploadFileEinkauf);
router.get('/download-invest/:filename', authenticateToken, downloadFileInvest);
router.post('/upload-invest', authenticateToken, uploadInvest.single('file'), uploadFileEinkaufInvest);

module.exports = router;