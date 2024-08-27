::: WordSection1
**[IT Beschaffung Web Application]{lang="DE"
style="font-size:24.0pt;font-family:\"Times New Roman\",serif"}**

[This project is a web application designed to manage and track IT
procurement processes. It allows users to upload PDF files, view, and
edit CSV records, and generate and download PDF files based on specific
templates.]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

**[Table of Contents]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

[[[Prerequisites]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#prerequisites)]{lang="DE"}

[[[Setup]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#setup)]{lang="DE"}

-   [[[Cloning the Repository]{style="font-size:12.0pt;font-family:
          \"Times New Roman\",serif"}](#cloning-the-repository)]{lang="DE"}
-   [[[Installing Dependencies]{style="font-size:12.0pt;font-family:
          \"Times New Roman\",serif"}](#installing-dependencies)]{lang="DE"}
-   [[[Configuring the Environment]{style="font-size:12.0pt;
          font-family:\"Times New Roman\",serif"}](#configuring-the-environment)]{lang="DE"}
-   [[[Setting Up the PDF Template]{style="font-size:12.0pt;
          font-family:\"Times New Roman\",serif"}](#setting-up-the-pdf-template)]{lang="DE"}

[[[Running the Application]{style="font-size:12.0pt;font-family:
     \"Times New Roman\",serif"}](#running-the-application)]{lang="DE"}

-   [[[Starting the Backend Server]{style="font-size:12.0pt;
          font-family:\"Times New Roman\",serif"}](#starting-the-backend-server)]{lang="DE"}
-   [[[Starting the Frontend]{style="font-size:12.0pt;font-family:
          \"Times New Roman\",serif"}](#starting-the-frontend)]{lang="DE"}

[[[Application Features]{style="font-size:12.0pt;font-family:
     \"Times New Roman\",serif"}](#application-features)]{lang="DE"}

[[[Usage]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#usage)]{lang="DE"}

-   [[[Uploading a
    PDF]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#uploading-a-pdf)]{lang="DE"}
-   [[[Viewing and Editing CSV Data]{style="font-size:12.0pt;
          font-family:\"Times New Roman\",serif"}](#viewing-and-editing-csv-data)]{lang="DE"}
-   [[[Generating and Downloading PDFs]{style="font-size:12.0pt;
          font-family:\"Times New Roman\",serif"}](#generating-and-downloading-pdfs)]{lang="DE"}

[[[API
Documentation]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#api-documentation)]{lang="DE"}

[[[Troubleshooting]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#troubleshooting)]{lang="DE"}

[[[Contributing]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#contributing)]{lang="DE"}

[[[License]{style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}](#license)]{lang="DE"}

**[Prerequisites]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

[Before you start, ensure you have the following installed on your
machine:]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

-   **[Node.js]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**[
    (v14 or higher)]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   **[npm]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**[
    (v6 or higher) or **yarn**]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   **[Git]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**

**[Setup]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

**[Cloning the Repository]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[First, clone the repository to your local machine using Git:]{lang="DE"
style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[git clone https://github.com/yourusername/it-beschaffung.git]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[cd it-beschaffung]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

**[Installing Dependencies]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[Navigate to the root directory of the project and install the required
dependencies for both the backend and frontend:]{lang="DE"
style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[npm install]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[If you are using yarn:]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[yarn install]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

**[Configuring the Environment]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[Create a ]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}[.env]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}[ file in the root
directory to store your environment variables. Below is a sample
configuration:]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[\# Backend]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[PORT=3000]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[JWT_SECRET=your_jwt_secret_key]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[ ]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[\# Frontend]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[REACT_APP_API_URL=http://localhost:3000]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[Make sure to replace ]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}[your_jwt_secret_key]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}[ with a secure
string.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Setting Up the PDF Template]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[The application uses JSON templates to generate PDFs. You need to place
your PDF template in the appropriate directory:]{lang="DE"
style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

1.  [Navigate to the ]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}[templates]{lang="DE"
    style="font-size:10.0pt;font-family:\"Courier New\""}[ directory in
    your project:]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[Code kopieren]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[mkdir -p templates]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

2.  [Create a ]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}[template-betrieb.json]{lang="DE"
    style="font-size:10.0pt;font-family:\"Courier New\""}[ file inside
    the ]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}[templates]{lang="DE"
    style="font-size:10.0pt;font-family:\"Courier New\""}[ directory.
    This file should contain the template for the PDF
    generation.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

[Example template:]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

[json]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[Code kopieren]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[{]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[  \"basePdf\": \"BLANK_PDF\",]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[  \"schemas\": \[]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[    {]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"produkt\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 50 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"accessorie\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 80 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"notes\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 110 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"Notebook\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 140 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"Tablet\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 170 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"Mobile\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 200 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"Storage\": { \"type\": \"text\", \"position\": { \"x\": 50,
\"y\": 230 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"Else\": { \"type\": \"text\", \"position\": { \"x\": 50, \"y\":
260 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"additionalNotes\": { \"type\": \"text\", \"position\": { \"x\":
50, \"y\": 290 }, \"width\": 200, \"height\": 20 },]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[      \"name\": { \"type\": \"text\", \"position\": { \"x\": 50, \"y\":
320 }, \"width\": 200, \"height\": 20 }]{lang="DE"
style="font-size:10.0pt;
font-family:\"Courier New\""}

[    }]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[  \]]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[}]{lang="DE" style="font-size:10.0pt;
font-family:\"Courier New\""}

[Adjust the positions and fields according to your specific
requirements.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Running the Application]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

**[Starting the Backend Server]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[To start the backend server, run:]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[npm run start:server]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[This will start the server on ]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}[http://localhost:3000]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}[.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Starting the Frontend]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

[In a separate terminal window, start the frontend:]{lang="DE"
style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

[bash]{lang="DE" style="font-size:10.0pt;font-family:\"Courier New\""}

[Code kopieren]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[npm run start]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}

[The frontend will be accessible at ]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}[http://localhost:5173]{lang="DE"
style="font-size:10.0pt;font-family:\"Courier New\""}[.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Application Features]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

-   **[CSV Viewer]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**[:
    View, search, and edit CSV records.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   **[PDF Upload]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**[:
    Upload signed PDF files and manage them.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   **[PDF Generation]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**[:
    Generate PDFs from CSV records using predefined
    templates.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Usage]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

**[Uploading a PDF]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

1.  [Navigate to the \"PDF Files\" section from the
    dashboard.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
2.  [Click on \"Upload PDF\".]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
3.  [Select the PDF file from your file system.]{lang="DE"
    style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
4.  [Click \"Upload\". The file will be uploaded to the server, and a
    notification will prompt you to update the file path in the Excel
    sheets section.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}

**[Viewing and Editing CSV Data]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

1.  [Navigate to the \"Excel-Sheet\" section.]{lang="DE"
    style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
2.  [Use the search bar to search for records by any column, such as ID
    or name.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
3.  [Click on a row to edit it, or click \"Add Entry\" to create a new
    record.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
4.  [Save changes, and the CSV file will be updated.]{lang="DE"
    style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}

**[Generating and Downloading PDFs]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

1.  [Ensure the CSV data is up-to-date with the correct file
    paths.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
2.  [The application will automatically generate PDFs when necessary,
    saving them in the configured directory.]{lang="DE"
    style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
3.  [Download the generated PDFs from the \"PDF Files\"
    section.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}

**[API Documentation]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

[The API provides endpoints for managing PDFs, CSV files, and user
authentication.]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

**[Endpoints]{lang="DE"
style="font-size:13.5pt;font-family:\"Times New Roman\",serif"}**

-   [GET /list-files/pdf]{lang="DE" style="font-size:
         10.0pt;font-family:\"Courier New\""}[: List all available PDF
    files.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   [GET /download/:filename]{lang="DE" style="font-size:
         10.0pt;font-family:\"Courier New\""}[: Download a specific PDF
    file.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   [POST /upload-pdf]{lang="DE" style="font-size:
         10.0pt;font-family:\"Courier New\""}[: Upload a new PDF
    file.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}
-   [POST /update-csv/:filename]{lang="DE" style="font-size:
         10.0pt;font-family:\"Courier New\""}[: Update a specific row in
    a CSV file.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

[For detailed documentation, refer to the API source code
comments.]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

**[Troubleshooting]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

**[Error: Cannot connect to the server.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**

-   [Ensure that the backend server is running and accessible on the
    correct port.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[PDF template not found.]{lang="DE"
style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}**

-   [Make sure the PDF template JSON file is correctly placed in the
    ]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}[templates]{lang="DE"
    style="font-size:10.0pt;font-family:\"Courier New\""}[
    directory.]{lang="DE"
    style="font-size:12.0pt;font-family:\"Times New Roman\",serif"}

**[Contributing]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

[If you\'d like to contribute to this project, please follow these
steps:]{lang="DE" style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}

1.  [Fork the repository.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
2.  [Create a new branch.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
3.  [Make your changes.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}
4.  [Submit a pull request.]{lang="DE" style="font-size:
         12.0pt;font-family:\"Times New Roman\",serif"}

**[License]{lang="DE"
style="font-size:18.0pt;font-family:\"Times New Roman\",serif"}**

[This project is licensed under the MIT License. See the ]{lang="DE"
style="font-size:
12.0pt;font-family:\"Times New Roman\",serif"}[LICENSE]{lang="DE"
style="font-size:10.0pt;font-family:
\"Courier New\""}[ file for details.]{lang="DE"
style="font-size:12.0pt;font-family:
\"Times New Roman\",serif"}

[ ]{lang="DE"}
:::
