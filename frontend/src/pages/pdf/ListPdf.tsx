import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../security/config";
import NormalCard from "../../components/dashboard/normalCrard";

// Define the ListPDF component using the React.FC type (Functional Component)
const ListPDF: React.FC = () => {
  // State variables to hold various data
  const [files, setFiles] = useState<string[]>([]); // Array of PDF files
  const [filesSigned, setFilesSigned] = useState<string[]>([]); // Array of signed PDF files
  const [error, setError] = useState<string | null>(null); // Error message state
  const [authToken, setAuthToken] = useState<string | null>(null); // Authentication token
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term input
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File selected for upload

  // useEffect hook to run on component mount
  useEffect(() => {
    // Get the authentication token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Set the token state if found
    } else {
      setError("No token found, please log in."); // Set error if no token is found
      return;
    }

    // Function to fetch the list of available PDF files
    const fetchFiles = async () => {
      try {
        // Make an API call to get the list of PDF files
        const response = await axios.get(`${API_BASE_URL}/list-files/pdf`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        // Update the files state with the data received from the API
        setFiles(response.data.files);
      } catch (err: any) {
        // Set an error message if the API call fails
        setError(
          "Error fetching files: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    // Function to fetch the list of signed PDF files
    const fetchFilesSigned = async () => {
      try {
        // Make an API call to get the list of signed PDF files
        const response = await axios.get(`${API_BASE_URL}/list-files/uploads`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });

        // Update the filesSigned state with the data received from the API
        setFilesSigned(response.data.files);
      } catch (err: any) {
        // Set an error message if the API call fails
        setError(
          "Error fetching files: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    // Call the functions to fetch files when the component mounts
    fetchFiles();
    fetchFilesSigned();
  }, [authToken]); // The effect runs again if authToken changes

  // Function to handle file download
  const handleDownload = async (fileName: string) => {
    try {
      // Make an API call to download the file
      const response = await axios.get(`${API_BASE_URL}/download/${fileName}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
        },
        responseType: "blob", // Fetch the file as binary large object (BLOB)
      });

      // Create a URL for the file blob and trigger a download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the filename for the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the link and revoke the object URL
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      // Set an error message if the download fails
      setError(
        "Error downloading file: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Function to handle changes in the search input field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update the search term state
  };

  // Function to handle changes in the file input field
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]); // Update the selectedFile state with the chosen file
    }
  };

  // Function to handle file uploads
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please Select a File!"); // Show an alert if no file is selected
      return;
    }

    const formData = new FormData(); // Create a FormData object for the file upload
    formData.append("file", selectedFile); // Append the selected file

    try {
      // Make an API call to upload the file
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
          "Content-Type": "multipart/form-data", // Set the content type for file upload
        },
      });

      // Refresh the file list after upload
      const response = await axios.get(`${API_BASE_URL}/list-files/uploads`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
        },
      });
      setFilesSigned(response.data.files); // Update the files state with the new file list
      setSelectedFile(null); // Clear the selectedFile state

      // Show a notification to update the file path in the Excel sheet
      alert(
        "File uploaded successfully. Please update the file path in the Excel sheet."
      );
    } catch (err: any) {
      // Set an error message if the upload fails
      setError(
        "Error uploading file: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // Filter the list of files based on the search term
  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter the list of signed files based on the search term
  const filteredFilesSigned = filesSigned.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render an error message if an error occurs
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f4ec] flex flex-col items-center justify-center p-4 dark:bg-[#1c242c]">
      <h1 className="text-2xl text-black font-bold mb-4 dark:text-gray-100">
        Available Files
      </h1>

      {/* Search Field */}
      <div className="mb-4 w-full max-w-4xl">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search files"
          className="px-4 bg-white text-gray-200 py-2 border rounded w-full dark:bg-[#1e293b]"
        />
      </div>

      {/* File Upload Section */}
      <div className="mb-4 w-full max-w-4xl flex items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="px-4 bg-white text-black py-2 border rounded w-full dark:text-gray-200 dark:bg-[#1e293b]" // Update to gray-800 for bg, gray-200 for text
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2 hover:bg-green-700"
        >
          Upload
        </button>
      </div>

      {/* File List */}
      <div className="flex flex-wrap justify-start gap-5 p-4">
        <NormalCard title="Nicht unterschriebe Datein">
          <ul className="w-full max-w-4xl">
            {filteredFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 p-2 bg-white shadow rounded dark:bg-[#1e293b]"
              >
                <span className="p-4 text-black dark:text-gray-100">
                  {file}
                </span>
                <button
                  onClick={() => handleDownload(file)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </NormalCard>
        <NormalCard title="Unterschriebe Datein">
          <ul className="w-full max-w-4xl">
            {filteredFilesSigned.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 p-2 bg-white shadow rounded dark:bg-[#1e293b]"
              >
                <span className="p-4 text-black dark:text-gray-100">
                  {file}
                </span>
                <button
                  onClick={() => handleDownload(file)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </NormalCard>
      </div>
    </div>
  );
};

export default ListPDF;
