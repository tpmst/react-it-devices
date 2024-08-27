import React, { useState, useEffect } from "react";
import axios from "axios";
import EditModal from "./EditModal"; // Adjust the path as necessary

const CSVViewer: React.FC = () => {
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No token found, please log in.");
      return;
    }

    const fetchCSVFile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/download-csv/01_it-beschaffung.csv",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text", // Fetches the file as plain text
          }
        );

        const parsedData = parseCSV(response.data);
        setData(parsedData);
      } catch (error: any) {
        setError(
          `Error fetching CSV file: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCSVFile();
  }, [authToken]);

  // Function to parse CSV data
  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(";"));
    return rows;
  };

  // Function to handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCellClick = (rowIndex: number) => {
    setSelectedRow(rowIndex);
    setIsModalOpen(true);
  };

  const handleAddEntry = () => {
    const currentIds = data.slice(1).map((row) => parseInt(row[0])); // Get all IDs from the first column
    const nextId = Math.max(...currentIds) + 1; // Find the next possible ID

    const newEntry = Array(data[0].length).fill(""); // Create a new empty entry
    newEntry[0] = nextId.toString(); // Set the ID field to the next ID

    setSelectedRow(data.length - 1); // Set the selected row to the new entry (last one)
    setIsModalOpen(true); // Open the modal
    setData((prevData) => [...prevData, newEntry]); // Add the new entry to the data
  };

  const handleSave = async (updatedData: string[]) => {
    if (selectedRow !== null) {
      const updatedRows = [...data];
      updatedRows[selectedRow + 1] = updatedData; // +1 to account for header row
      setData(updatedRows);

      try {
        await axios.post(
          "http://localhost:3000/update-csv/01_it-beschaffung.csv",
          { rowIndex: selectedRow, updatedData },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } catch (error: any) {
        setError(
          `Error updating CSV file: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  // Filter the rows based on the search term (now searches all columns)
  const filteredData = searchTerm
    ? data
        .slice(1)
        .filter((row) =>
          row.some((cell) =>
            cell.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
    : data.slice(1);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="px-4 py-2 border rounded w-full"
        />
        <button
          onClick={handleAddEntry}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Entry
        </button>
      </div>

      {/* Table with scroll and highlight */}
      <div className="overflow-auto h-[80vh] w-full border border-gray-300">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {data[0]?.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border sticky top-0 bg-gray-200"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="cursor-pointer"
                onClick={() => handleCellClick(rowIndex)}
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 border">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow !== null ? data[selectedRow + 1] : []} // +1 to skip header row
        onSave={handleSave}
      />
    </div>
  );
};

export default CSVViewer;
