const fs = require('fs');
const path = require('path')

function getSettings(req, res) {
    const filePath = path.join(__dirname, '../files/config', 'config.json');
    if (!fs.existsSync(filePath)) {
      throw new Error('Config data file not found'); // Error if the file does not exist
    }
    const data = fs.readFileSync(filePath, 'utf8'); // Read the JSON file

    if (data) {
        res.json(JSON.parse(data));
    } else {
        res.status(404).json({ message: 'File not found' });
    }
}

function updateSettings(req, res) {
    const filePath = path.join(__dirname, '../files/config', 'config.json');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: '../files/Config data file not found' });
    }

    try {
        // Read existing config file
        const existingData = fs.readFileSync(filePath, 'utf8');
        const configData = JSON.parse(existingData);

        // Get the updated data from the request body
        const updatedData = req.body;

        // Merge the new data into the existing config
        const newConfig = { ...configData, ...updatedData };

        // Write the updated config back to the file
        fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2), 'utf8');

        res.json({ message: 'Settings updated successfully', newConfig });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
}

module.exports = {
    getSettings,
    updateSettings
};