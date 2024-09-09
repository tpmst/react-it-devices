const fs = require('fs');
const path = require('path');
const multer = require('multer');
// Set up multer for file storage

const storageRechnungen = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../files/rechnungen');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadRechnungen = multer({ storage: storageRechnungen });

// Upload a file
function uploadFileEinkauf(req, res) {
    const filePath = path.join(__dirname, '../files/rechnungen', req.file.filename);
    res.json({ message: 'File uploaded successfully', filePath });
}

// Download a specific file
function downloadFileRechnungen(req, res) {
    const filePath = path.join(__dirname, '../files/rechnungen', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
}

const storageInvest = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../files/investantrag');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploadInvest = multer({ storage: storageInvest });

// Upload a file
function uploadFileEinkaufInvest(req, res) {
    const filePath = path.join(__dirname, '../files/investantrag', req.file.filename);
    res.json({ message: 'File uploaded successfully', filePath });
}

// Download a specific file
function downloadFileInvest(req, res) {
    const filePath = path.join(__dirname, '../files/investantrag', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
}

module.exports = {
    downloadFileRechnungen,
    uploadFileEinkauf,
    uploadRechnungen,

    uploadFileEinkaufInvest,
    uploadInvest,
    downloadFileInvest,
};
