import React, { useState, useEffect } from "react";
import axios from "axios";
import CardComponent from "../../components/cardComponent";

const ListPDF: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [filesSigned, setFilesSigned] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No token found, please log in.");
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/list-files/pdf",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFiles(response.data.files);
      } catch (err: any) {
        setError(
          "Error fetching files: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    const fetchFilesSigned = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/list-files/uploads",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFilesSigned(response.data.files);
      } catch (err: any) {
        setError(
          "Error fetching files: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    fetchFiles();
    fetchFilesSigned();
  }, [authToken]);

  const handleDownload = async (fileName: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/download/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob", // This is important for file downloads
        }
      );

      // Create a URL for the file and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the downloaded file name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(
        "Error downloading file: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please Select a File!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the file list after upload
      const response = await axios.get(
        "http://localhost:3000/list-files/uploads",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFiles(response.data.files);
      setSelectedFile(null);

      // Show the notification to update the file path in the Excel sheet
      alert(
        "File uploaded successfully. Please update the file path in the Excel sheet."
      );
    } catch (err: any) {
      setError(
        "Error uploading file: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFilesSigned = filesSigned.filter((filesSigned) =>
    filesSigned.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Available Files</h1>

      {/* Search Field */}
      <div className="mb-4 w-full max-w-4xl">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search files"
          className="px-4 py-2 border rounded w-full"
        />
      </div>

      {/* File Upload Section */}
      <div className="mb-4 w-full max-w-4xl flex items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="px-4 py-2 border rounded w-full"
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
        <CardComponent title="Nicht unterschriebe Datein">
          <ul className="w-full max-w-4xl">
            {filteredFiles.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 p-2 bg-white shadow rounded"
              >
                <span className="p-4">{file}</span>
                <button
                  onClick={() => handleDownload(file)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </CardComponent>
        <CardComponent title="Unterschriebe Datein">
          <ul className="w-full max-w-4xl">
            {filteredFilesSigned.map((file, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2 p-2 bg-white shadow rounded"
              >
                <span className="p-4">{file}</span>
                <button
                  onClick={() => handleDownload(file)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        </CardComponent>
      </div>
    </div>
  );
};

export default ListPDF;
