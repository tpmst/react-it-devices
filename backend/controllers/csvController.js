const fs = require('fs');
const path = require('path');
const { generate } = require('@pdfme/generator');

function validateFields(fields) {
    return fields.every(field => field !== undefined && field !== null && field !== '');
}

// Update a CSV file based on row index
function updateCsv(req, res) {
    const { rowIndex, updatedData } = req.body;
  const csvFilePath = path.join(__dirname, '../files/csv', req.params.filename);

  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });

    const rows = data.split('\n');
    rows[rowIndex + 1] = updatedData.join(';'); // +1 to skip header row

    fs.writeFile(csvFilePath, rows.join('\n'), async (err) => {
      if (err) return res.status(500).json({ message: 'Error writing file' });

      const [ID, date, department, requester, itName, product, sn,accessories, details, bes, filePath] = updatedData;
      const fieldsToCheck = [ID, date, department, requester, itName,product, bes];
      
      if (validateFields(fieldsToCheck)) {
        if (filePath) {
          // Handle the renaming of the existing file if filePath is provided
          const fileName = `${ID}-${date}-${requester}-${product}.pdf`;
          const filenameSigned = `${ID}-${date}-${requester}-${product}_Signed.pdf`;
          const newFilePathSigned = path.join(__dirname, '../files/uploads', filenameSigned);
          const existingFilePath = path.join(__dirname, '../files/uploads', filePath);
          const existingOldUnsigned = path.join(__dirname, '../files/pdf', fileName);

          if (fs.existsSync(existingFilePath)) {
            fs.rename(existingFilePath, newFilePathSigned, (err) => {
              if (err) {
                console.error('Error renaming file:', err);
              } else {
                console.log('File renamed successfully to:', newFilePathSigned);

                if (fs.existsSync(existingOldUnsigned)) {
                  fs.unlink(existingOldUnsigned, (err) => {
                    if (err) {
                      console.error('Error deleting file:', err);
                    }
                  });
                }

                // Update the file path in the CSV
                updatedData[updatedData.length - 1] = filenameSigned; // Ensure the file path is updated
                rows[rowIndex + 1] = updatedData.join(';');
                
                fs.writeFile(csvFilePath, rows.join('\n'), (err) => {
                  if (err) {
                    console.error('Error updating CSV file:', err);
                  } else {
                    console.log('CSV file updated successfully with new file path.');
                  }
                });
              }
            });
          }
        } else {
          // Handle PDF generation if filePath is not provided
          const templatePath = path.join(__dirname, '../files/templates', 'template-betrieb.json');
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

          if (details !== undefined && details !== null && details != "") {
            other = "X";
          }

          const inputs = [
            {
              "produkt": product + " S/N:" + sn,
              "accessorie": details,
              "notes": bes,
              "Notebook": notebook,
              "Tablet": tab,
              "Mobile": mob,
              "Storage": store,
              "Else": other,
              "name": requester,
              "Uname": requester,
              "Uname2": itName,
            }
          ];
          const fileName = `${ID}-${date}-${requester}-${product}.pdf`;
          const newFilePath = path.join(__dirname, '../files/pdf', fileName);
          if (!fs.existsSync(newFilePath)) {
            generate({ template, inputs }).then((pdfBuffer) => {
              fs.writeFileSync(newFilePath, pdfBuffer);
              console.log('PDF created successfully.');
            });
          }
        }
      }
    });
  });
}

function updateCsvKlein(req, res){
    const { rowIndex, updatedData } = req.body;
  const csvFilePath = path.join(__dirname, '../files/csv', req.params.filename);

  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading file' });

    const rows = data.split('\n');
    rows[rowIndex + 1] = updatedData.join(';'); // +1 to skip header row

    fs.writeFile(csvFilePath, rows.join('\n'), async (err) => {
      if(err){
        console.log("Error updateing Table" + err)
      }
    });
  });
}

// Download a specific CSV file
function downloadCsv(req, res) {
    const filePath = path.join(__dirname, '../files/csv', req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send({ message: 'File not found' });
    }
}

module.exports = {
    updateCsv,
    downloadCsv,
    updateCsvKlein
};
