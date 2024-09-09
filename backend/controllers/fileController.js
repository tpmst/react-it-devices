const fs = require('fs');
const path = require('path');
const multer = require('multer');
// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../files/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Upload a file
function uploadFile(req, res) {
    const filePath = path.join(__dirname, '../files/uploads', req.file.filename);
    res.json({ message: 'File uploaded successfully', filePath });
}

function listFiles(req, res) {
    const folderName = req.params.folder;

  // Sanitize the folder name
  if (!folderName || folderName.includes('..')) {
    return res.status(400).json({ message: 'Invalid folder name' });
  }

  const directoryPath = path.join(__dirname, '../files', folderName);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to scan directory', error: err.message });
    }

    const fileList = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile());

    res.json({ files: fileList });
  });
}

// Download a specific file
function downloadFile(req, res) {
    const filePath = path.join(__dirname, '../files/pdf', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
}

function downloadFileSigned(req, res) {
    const filePath = path.join(__dirname, '../files/uploads', req.params.filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'File not found' });
    }
}


module.exports = {
    downloadFile,
    listFiles,
    uploadFile,
    downloadFileSigned,
    upload,
};
