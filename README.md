# IT Beschaffung Web Application

This project is a web application designed to manage and track IT procurement processes. It allows users to upload PDF files, view and edit CSV records, and generate and download PDF files based on specific templates.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Cloning the Repository](#cloning-the-repository)
  - [Installing Dependencies](#installing-dependencies)
  - [Configuring the Environment](#configuring-the-environment)
  - [Setting Up the PDF Template](#setting-up-the-pdf-template)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend](#starting-the-frontend)
- [Applicationlooks](#application-looks)
- [Application Features](#application-features)
- [Usage](#usage)
  - [Uploading a PDF](#uploading-a-pdf)
  - [Viewing and Editing CSV Data](#viewing-and-editing-csv-data)
  - [Generating and Downloading PDFs](#generating-and-downloading-pdfs)
  - [Languages](#language)
- [API Documentation](#api-documentation)
- [Adding a Printer](#adding-a-printer)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you start, ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Git**

## Setup

### Cloning the Repository

First, clone the repository to your local machine using Git:

```bash
git clone https://github.com/yourusername/it-beschaffung.git
cd it-beschaffung
```

### Installing Dependencies
Navigate to the root directory of the project and install the required dependencies for both the backend and frontend:

```bash
npm install
```
If you are using yarn:
```bash
yarn install
```

### Configuring the Environment
Create a .env file in the root directory to store your environment variables. Below is a sample configuration:

```bash
# Backend
PORT=3000
JWT_SECRET=your_jwt_secret_key

# Frontend
REACT_APP_API_URL=http://localhost:3000
```
Make sure to replace your_jwt_secret_key with a secure string.

### Setting Up the PDF Template
The application uses JSON templates to generate PDFs. You need to place your PDF template in the appropriate directory:

Navigate to the templates directory in your project:
```bash
mkdir -p templates
```
Create a template-betrieb.json file inside the templates directory. This file should contain the template for the PDF generation.
You can create own Templates on https://pdfme.com/template-design.

Example template:
```json
{
  "basePdf": "BLANK_PDF",
  "schemas": [
    {
      "produkt": { "type": "text", "position": { "x": 50, "y": 50 }, "width": 200, "height": 20 },
      "accessorie": { "type": "text", "position": { "x": 50, "y": 80 }, "width": 200, "height": 20 },
      "notes": { "type": "text", "position": { "x": 50, "y": 110 }, "width": 200, "height": 20 },
      "Notebook": { "type": "text", "position": { "x": 50, "y": 140 }, "width": 200, "height": 20 },
      "Tablet": { "type": "text", "position": { "x": 50, "y": 170 }, "width": 200, "height": 20 },
      "Mobile": { "type": "text", "position": { "x": 50, "y": 200 }, "width": 200, "height": 20 },
      "Storage": { "type": "text", "position": { "x": 50, "y": 230 }, "width": 200, "height": 20 },
      "Else": { "type": "text", "position": { "x": 50, "y": 260 }, "width": 200, "height": 20 },
      "additionalNotes": { "type": "text", "position": { "x": 50, "y": 290 }, "width": 200, "height": 20 },
      "name": { "type": "text", "position": { "x": 50, "y": 320 }, "width": 200, "height": 20 }
    }
  ]
}
```
Adjust the positions and fields according to your specific requirements.

## Running the Application
### Starting the Backend Server
To start the backend server navigate into the backend folder and run:
```bash
node app.js
```
This will start the server on http://localhost:3000.

### Starting the Frontend
In a separate terminal window, start the frontend:
```bash
npm run start
```
The frontend will be accessible at http://localhost:5173.

## Application Looks
### Dashboard(german in dark-mode)
![image](https://github.com/user-attachments/assets/03529b12-4644-4030-85b7-86c1c8afb13b)

### Dashboard(english in light-mode)
![image](https://github.com/user-attachments/assets/f6a2dc12-cf2d-47d4-988c-f6c23b592ebd)

### Buying
![image](https://github.com/user-attachments/assets/ae59528c-9e0b-4933-9510-aeeef8734049)

### Small hardware
![image](https://github.com/user-attachments/assets/6e066ce2-aa8d-43e0-9f17-9053858b3ecb)

### Printers
![image](https://github.com/user-attachments/assets/b6d4b1c3-712a-42a0-9fe6-baed549d6ddc)


## Application Features
 -**CSV Viewer:** View, search, and edit CSV records.
 -**PDF Upload:** Upload signed PDF files and manage them.
 -**PDF Generation:** Generate PDFs from CSV records using predefined templates.

## Usage
### Uploading a PDF.
1. Navigate to the "PDF Files" section from the dashboard.
2. Click on "Upload PDF".
3. Select the PDF file from your file system.
4. Click "Upload". The file will be uploaded to the server, and a notification will prompt you to update the file path in the Excel sheets section.

### Viewing and Editing CSV Data
1. Navigate to the "Excel-Sheet" section.
2. Use the search bar to search for records by any column, such as ID or name.
3. Click on a row to edit it, or click "Add Entry" to create a new record.
4. Save changes, and the CSV file will be updated.

### Generating and Downloading PDFs
Ensure the CSV data is up-to-date with the correct file paths.
The application will automatically generate PDFs when necessary, saving them in the configured directory.
Download the generated PDFs from the "PDF Files" section.

### Language
There is a locals folder where you can take the en/translation.json and translate it into your Language. But in some cases the Language is depending on the CSV-Files you have in your backend, so you maby need to change some parts of the code for example in the EditModals for the tabels.

## API Documentation
The API provides endpoints for managing PDFs, CSV files, and user authentication.

### Endpoints
```bash
For Endpoints look into backend/routes
```
For detailed documentation, refer to the API source code comments.

## Adding a Printer
For adding a Printer take a look into my two reposetorys for kyocera printer:
1. https://github.com/tpmst/read-printer-tonerlevel-kyocera
2. https://github.com/tpmst/read-printer-counts-kyocera

If you dont have koycera printers you can either delete this tap or try to get the SNMP-OIDs for your printers.


## Troubleshooting
Error: Cannot connect to the server.
Ensure that the backend server is running and accessible on the correct port.
PDF template not found.
Make sure the PDF template JSON file is correctly placed in the templates directory.

## Contributing
If you'd like to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch.
Make your changes.
Submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
