const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { downloadFile, listFiles, uploadFile, upload, downloadFileSigned } = require('../controllers/fileController');

router.get('/download/:filename', authenticateToken, downloadFile);
router.get('/download-signed/:filename', authenticateToken, downloadFileSigned);
router.get('/list-files/:folder', authenticateToken, listFiles)
router.post('/upload', authenticateToken, upload.single('file'), uploadFile);

module.exports = router;
