IT Beschaffung Web Application This project is a web application
designed to manage and track IT procurement processes. It allows users
to upload PDF files, view, and edit CSV records, and generate and
download PDF files based on specific templates. Table of Contents •
Prerequisites • Setup o Cloning the Repository o Installing Dependencies
o Configuring the Environment o Setting Up the PDF Template • Running
the Application o Starting the Backend Server o Starting the Frontend •
Application Features • Usage o Uploading a PDF o Viewing and Editing CSV
Data o Generating and Downloading PDFs • API Documentation •
Troubleshooting • Contributing • License Prerequisites Before you start,
ensure you have the following installed on your machine: • Node.js (v14
or higher) • npm (v6 or higher) or yarn • Git Setup Cloning the
Repository First, clone the repository to your local machine using Git:
bash Code kopieren git clone
https://github.com/yourusername/it-beschaffung.git cd it-beschaffung
Installing Dependencies Navigate to the root directory of the project
and install the required dependencies for both the backend and frontend:
bash Code kopieren npm install If you are using yarn: bash Code kopieren
yarn install Configuring the Environment Create a .env file in the root
directory to store your environment variables. Below is a sample
configuration: bash Code kopieren \# Backend PORT=3000
JWT_SECRET=your_jwt_secret_key

\# Frontend REACT_APP_API_URL=http://localhost:3000 Make sure to replace
your_jwt_secret_key with a secure string. Setting Up the PDF Template
The application uses JSON templates to generate PDFs. You need to place
your PDF template in the appropriate directory: 1. Navigate to the
templates directory in your project: bash Code kopieren mkdir -p
templates 2. Create a template-betrieb.json file inside the templates
directory. This file should contain the template for the PDF generation.
Example template: json Code kopieren { \"basePdf\": \"BLANK_PDF\",
\"schemas\": \[ { \"produkt\": { \"type\": \"text\", \"position\": {
\"x\": 50, \"y\": 50 }, \"width\": 200, \"height\": 20 },
\"accessorie\": { \"type\": \"text\", \"position\": { \"x\": 50, \"y\":
80 }, \"width\": 200, \"height\": 20 }, \"notes\": { \"type\": \"text\",
\"position\": { \"x\": 50, \"y\": 110 }, \"width\": 200, \"height\": 20
}, \"Notebook\": { \"type\": \"text\", \"position\": { \"x\": 50, \"y\":
140 }, \"width\": 200, \"height\": 20 }, \"Tablet\": { \"type\":
\"text\", \"position\": { \"x\": 50, \"y\": 170 }, \"width\": 200,
\"height\": 20 }, \"Mobile\": { \"type\": \"text\", \"position\": {
\"x\": 50, \"y\": 200 }, \"width\": 200, \"height\": 20 }, \"Storage\":
{ \"type\": \"text\", \"position\": { \"x\": 50, \"y\": 230 },
\"width\": 200, \"height\": 20 }, \"Else\": { \"type\": \"text\",
\"position\": { \"x\": 50, \"y\": 260 }, \"width\": 200, \"height\": 20
}, \"additionalNotes\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 290 }, \"width\": 200, \"height\": 20 }, \"name\": { \"type\":
\"text\", \"position\": { \"x\": 50, \"y\": 320 }, \"width\": 200,
\"height\": 20 } } \] } Adjust the positions and fields according to
your specific requirements. Running the Application Starting the Backend
Server To start the backend server, run: bash Code kopieren npm run
start:server This will start the server on http://localhost:3000.
Starting the Frontend In a separate terminal window, start the frontend:
bash Code kopieren npm run start The frontend will be accessible at
http://localhost:5173. Application Features • CSV Viewer: View, search,
and edit CSV records. • PDF Upload: Upload signed PDF files and manage
them. • PDF Generation: Generate PDFs from CSV records using predefined
templates. Usage Uploading a PDF 1. Navigate to the \"PDF Files\"
section from the dashboard. 2. Click on \"Upload PDF\". 3. Select the
PDF file from your file system. 4. Click \"Upload\". The file will be
uploaded to the server, and a notification will prompt you to update the
file path in the Excel sheets section. Viewing and Editing CSV Data 1.
Navigate to the \"Excel-Sheet\" section. 2. Use the search bar to search
for records by any column, such as ID or name. 3. Click on a row to edit
it, or click \"Add Entry\" to create a new record. 4. Save changes, and
the CSV file will be updated. Generating and Downloading PDFs 1. Ensure
the CSV data is up-to-date with the correct file paths. 2. The
application will automatically generate PDFs when necessary, saving them
in the configured directory. 3. Download the generated PDFs from the
\"PDF Files\" section. API Documentation The API provides endpoints for
managing PDFs, CSV files, and user authentication. Endpoints • GET
/list-files/pdf: List all available PDF files. • GET
/download/:filename: Download a specific PDF file. • POST /upload-pdf:
Upload a new PDF file. • POST /update-csv/:filename: Update a specific
row in a CSV file. For detailed documentation, refer to the API source
code comments. Troubleshooting • Error: Cannot connect to the server. o
Ensure that the backend server is running and accessible on the correct
port. • PDF template not found. o Make sure the PDF template JSON file
is correctly placed in the templates directory. Contributing If you\'d
like to contribute to this project, please follow these steps: 1. Fork
the repository. 2. Create a new branch. 3. Make your changes. 4. Submit
a pull request. License This project is licensed under the MIT License.
See the LICENSE file for details.
