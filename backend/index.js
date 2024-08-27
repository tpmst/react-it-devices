const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csv = require('csv-parser');
const {generate} = require('@pdfme/generator');

// Initialize the app
const app = express();
const PORT = 3000;

// Use the CORS middleware to allow requests from different origins
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

app.use(express.json());

// Secret key for JWT
const SECRET_KEY = 'your_secret_key_here';

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
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

// Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Bearer string
    if (!token) return res.status(401).json({ message: 'No token provided' });
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
  }
  

// Function to read login data from JSON file
function getUsers() {
  const filePath = path.join(__dirname, 'logins', 'logindata.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('Login data file not found');
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Function to log login attempts
function logLogin(username) {
  const logFilePath = path.join(__dirname, 'logins', 'login_log.csv');

  const csvWriter = createCsvWriter({
    path: logFilePath,
    header: [
      { id: 'timestamp', title: 'Timestamp' },
      { id: 'username', title: 'Username' }
    ],
    append: true,
  });

  const timestamp = new Date().toISOString();
  const record = { timestamp, username };

  csvWriter.writeRecords([record])
    .then(() => {
      console.log('Login record added to CSV');
    })
    .catch(err => {
      console.error('Error writing to CSV:', err);
    });
}

// Login Endpoint
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    const users = getUsers(); // Fetch users from JSON file

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    logLogin(username);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
});

// Logout Endpoint
app.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Protected endpoint to upload a file
app.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  res.send({ message: 'File uploaded successfully', filePath });
});

// Protected endpoint to read and modify a CSV file
app.post('/edit-csv', authenticateToken, upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'csv', req.file.filename);

  const data = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      const newRow = { Name: "New Entry", Value: (Math.random() * 100).toFixed(2) };
      data.push(newRow);

      const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(newRow).map(key => ({ id: key, title: key })),
      });

      csvWriter.writeRecords(data)
        .then(() => {
          res.send({ message: 'CSV file updated successfully', filePath });
        })
        .catch(err => {
          res.status(500).json({ message: 'An error occurred while writing to the CSV file', error: err.message });
        });
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'An error occurred while reading the CSV file', error: err.message });
    });
});

function validateFields(fields) {
  return fields.every(field => field !== undefined && field !== null && field !== '');
}


app.post('/update-csv/:filename', authenticateToken, (req, res) => {
  const { rowIndex, updatedData } = req.body;
  const filePath = path.join(__dirname, 'csv', req.params.filename);

  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ message: 'Error reading file' });

      const rows = data.split('\n');
      rows[rowIndex + 1] = updatedData.join(';'); // +1 to skip header row

      fs.writeFile(filePath, rows.join('\n'), async (err) => {
          if (err) return res.status(500).json({ message: 'Error writing file' });
          const [ID, date, category, department, requester, , , product, sn, , , , , , , ,accessories,details,bes,filePath ] = updatedData;
          const fieldsToCheck = [ID, date, category, department, requester, product, bes];
          if(validateFields(fieldsToCheck)){

            if(filePath){
              const fileName = `${ID}-${date}-${requester}-${product}.pdf`;
              const existingFilePath = path.join(__dirname, 'pdf', fileName);
              if (fs.existsSync(existingFilePath)) {
                  fs.unlink(existingFilePath, (err) => {
                      if (err) {
                          console.error('Error deleting file:', err);
                      } else {
                          console.log('File deleted successfully.');
                      }
                  });
              }
            }else{

              const templatePath = path.join(__dirname, 'templates' ,'template-betrieb.json');
              const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));

              let notebook = "";
              let tab = "";
              let mob = "";
              let store = "";
              let other = "";

              if (accessories === "Notebook") {
                  notebook = "X";
              } else if (accessories === "Tablet") {
                  tab = "X";
              } else if (accessories === "Mobiltelefon") {
                  mob = "X";
              } else if (accessories === "Speichergerät") {
                  store = "X";
              } else {
                  other = "X";
              }

              if(details !== undefined && details !== null && details != ""){
                other = "X";
              }


              const inputs = [
                {
                  "produkt": product  + " S/N:" + sn ,
                  "accessorie": details,
                  "notes": bes,
                  "Notebook": notebook,
                  "Tablet": tab,
                  "Mobile": mob,
                  "Storage": store,
                  "Else": other,
                  "additionalNotes": "",
                  "name": requester
                }
              ];
              const fileName = `${ID}-${date}-${requester}-${product}.pdf`;
              const newFilePath = path.join(__dirname, 'pdf', fileName);
              if (!fs.existsSync(newFilePath)) {
                generate({ template, inputs }).then((pdfBuffer) => {
                  // Save the generated PDF to a file
                  fs.writeFileSync(newFilePath, pdfBuffer);
                  console.log('PDF created successfully.');
                });
              }
            }
          }
      });
  });
});

  

// Function to add a line to a CSV file
app.post('/add-line', authenticateToken, (req, res) => {
  const filePath = path.join(__dirname, 'csv', '01_it-beschaffung.csv');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  const data = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      const newRow = req.body.newRow;
      data.push(newRow);

      const csvWriter = createCsvWriter({
        path: filePath,
        header: Object.keys(newRow).map(key => ({ id: key, title: key })),
      });

      csvWriter.writeRecords(data)
        .then(() => {
          res.json({ message: 'Row added successfully', newRow });
        })
        .catch(err => {
          res.status(500).json({ message: 'An error occurred while writing to the CSV file', error: err.message });
        });
    })
    .on('error', (err) => {
      res.status(500).json({ message: 'An error occurred while reading the CSV file', error: err.message });
    });
});

app.get('/list-files/:folder', (req, res) => {
    const folderName = req.params.folder;
  
    // Sanitize the folder name
    if (!folderName || folderName.includes('..')) {
      return res.status(400).json({ message: 'Invalid folder name' });
    }
  
    const directoryPath = path.join(__dirname, folderName);

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to scan directory', error: err.message });
      }
  
      const fileList = files.filter(file => fs.statSync(path.join(directoryPath, file)).isFile());
  
      res.json({ files: fileList });
    });
  });
  
  // Route to download a specific file
  app.get('/download/:filename', authenticateToken, (req, res) => {
    const filename = req.params.filename;
  
    // Sanitize the filename
    if (!filename || filename.includes('..')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }
  
    const filePath = path.join(__dirname, 'pdf', filename);
  
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

app.get('/download-csv/:filename', authenticateToken, (req, res) => {
    const filePath = path.join(__dirname, 'csv', req.params.filename);
  
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).send({ message: 'File not found' });
    }
  });


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
