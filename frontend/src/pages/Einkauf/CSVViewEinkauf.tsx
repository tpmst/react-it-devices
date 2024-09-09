import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../security/config"; // Base URL for API requests
import EditModalEinkauf from "./EditModalEinkauf";

// CSVViewer component for displaying and editing CSV data
const CSVViewEinkauf: React.FC = () => {
  // State to store CSV data, error messages, authentication token, search term, and modal visibility
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectableDevices, setSelectableDevices] = useState<string[]>([]); // State to hold all unique devices
  const [selectableNumbers, setSelectableNumbers] = useState<string[]>([]);
  const [forEdit, setForEdit] = useState(false); // State to hold all unique devices

  // Effect hook to fetch authentication token and CSV data on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Set token in state
    } else {
      setError("No token found, please log in."); // Set error if token not found
      return;
    }

    // Fetch the CSV file from the server
    const fetchCSVFile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/download-csv/03_it-einkauf.csv`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text", // Fetch as plain text
          }
        );

        const parsedData = parseCSV(response.data); // Parse the CSV data
        setData(parsedData); // Store parsed data in state

        // Extract unique devices from the "Gerät" column (index 2)
        const devices = extractUniqueDevices(parsedData, 6);
        setSelectableDevices(devices);
        const numbers = extractUniqueDevices(parsedData, 2);
        setSelectableNumbers(numbers);
      } catch (error: any) {
        setError(
          `Error fetching CSV file: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCSVFile(); // Call the function to fetch CSV data
  }, [authToken]); // Re-run the effect if authToken changes

  // Function to parse CSV data into a 2D array of strings
  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(";"));
    return rows;
  };

  // Function to extract unique devices from a specific column in the CSV data
  const extractUniqueDevices = (
    data: string[][],
    columnIndex: number
  ): string[] => {
    const deviceSet = new Set<string>(); // Use a set to store unique devices
    data.slice(1).forEach((row) => {
      const device = row[columnIndex].trim();
      if (device) {
        deviceSet.add(device);
      }
    });
    return Array.from(deviceSet); // Convert set back to an array
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle cell click to open the edit modal for the selected row
  const handleCellClick = (rowIndex: number) => {
    setSelectedRow(rowIndex);
    setForEdit(true);
    setIsModalOpen(true);
  };

  // Handle adding a new entry to the CSV data
  const handleAddEntry = () => {
    const currentIds = data.slice(1).map((row) => parseInt(row[0])); // Extract IDs from the first column
    const nextId = Math.max(...currentIds) + 1; // Find the next available ID

    const newEntry = Array(data[0].length).fill(""); // Create a new empty row
    newEntry[0] = nextId.toString(); // Set the ID for the new row

    setSelectedRow(data.length - 1); // Select the new row
    setForEdit(false);
    setIsModalOpen(true); // Open the modal for editing
    setData((prevData) => [...prevData, newEntry]); // Add the new row to the data
  };

  // Handle saving the updated row data
  const handleSave = async (updatedData: string[]) => {
    if (selectedRow !== null) {
      const updatedRows = [...data];
      updatedRows[selectedRow + 1] = updatedData; // Update the selected row (+1 to skip header row)
      setData(updatedRows); // Update the data state

      try {
        await axios.post(
          `${API_BASE_URL}/update-csv-klein/03_it-einkauf.csv`,
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

  // Filter the data based on the search term (searches all columns)
  const isRowValid = (row: string[]): boolean => {
    const hasOnlyID =
      row[0] && row.slice(1).every((cell) => cell.trim() === "");
    const isEmptyRow = row.every((cell) => cell.trim() === "");
    return !hasOnlyID && !isEmptyRow;
  };

  const filteredData = searchTerm
    ? data
        .slice(1)
        .filter(
          (row) =>
            row.some((cell) =>
              cell.toLowerCase().includes(searchTerm.toLowerCase())
            ) && isRowValid(row)
        )
    : data.slice(1).filter(isRowValid);

  // Render error message if there's an error
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
          className="px-4 bg-white text-gray-200 py-2 border rounded w-full dark:bg-[#1e293b] "
        />
        <button
          onClick={handleAddEntry}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Entry
        </button>
      </div>

      {/* Table with scroll and highlight */}
      <div className="overflow-auto bg-white h-[80vh] w-full border border-gray-300 dark:bg-[#1e293b]">
        <table className="min-w-full bg-white dark:bg-[#1e293b]">
          <thead>
            <tr>
              {data[0]?.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2 bg-gray-200 border sticky top-0 dark:text-gray-100 dark:bg-gray-700"
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
                  <td
                    key={cellIndex}
                    className={`px-4 py-2 border bg-white text-black dark:bg-gray-600 dark:text-gray-100`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <EditModalEinkauf
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedRow !== null ? data[selectedRow + 1] : []} // +1 to skip header row
        onSave={handleSave}
        allDevices={selectableDevices}
        allNumbers={selectableNumbers}
        forEdit={forEdit} // Pass the unique devices to the modal
      />
    </div>
  );
};

export default CSVViewEinkauf;
