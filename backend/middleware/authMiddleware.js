const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key_here';
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

function getUsers() {
  
    const filePath = path.join(__dirname, 'logins', 'logindata.json');
    if (!fs.existsSync(filePath)) {
      throw new Error('Login data file not found'); // Error if the file does not exist
    }
    const data = fs.readFileSync(filePath, 'utf8'); // Read the JSON file
    return JSON.parse(data); // Parse and return the data
}

function logLogin(username) {
    
    const logFilePath = path.join(__dirname, 'logins', 'login_log.csv');
    const csvWriter = createCsvWriter({
      path: logFilePath,
      header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'username', title: 'Username' }
      ],
      append: true, // Append new logs to the CSV file
    });
  
    const timestamp = new Date().toISOString(); // Get the current timestamp
    const record = { timestamp, username }; // Create a log entry
  
    csvWriter.writeRecords([record])
      .then(() => {
        console.log('Login record added to CSV');
      })
      .catch(err => {
        console.error('Error writing to CSV:', err);
      });
  }

async function login(req, res){
    

    try {
        const { username, password } = req.body;
        
        const users = getUsers(); // Fetch users from JSON file
        const user = users.find(u => u.username === username && password === u.password);
        
        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }        
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '10h' });
        logLogin(username); // Log the login attempt
        res.json({ token });
        
      } catch (error) {
        res.status(500).json({ message: 'An error occurred during login', error: error.message });
      }
}

module.exports = { authenticateToken, login };
