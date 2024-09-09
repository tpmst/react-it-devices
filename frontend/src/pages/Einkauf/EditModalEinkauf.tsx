import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../../security/config";
import { useSettings } from "../../security/SettingsContex";

interface EditModalProps {
  isOpen: boolean; // Determines if the modal is open
  onClose: () => void; // Function to close the modal
  data: string[]; // Data to be edited, passed as an array of strings
  onSave: (updatedData: string[]) => void; // Function to save the updated data
  allDevices: string[];
  allNumbers: string[];
  forEdit: boolean; // List of all previously entered devices
}

const EditModalEinkauf: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  allDevices,
  allNumbers,
  forEdit,
}) => {
  const [formData, setFormData] = useState<string[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<string[]>([]);
  const [filteredNumbers, setFilteredNumbers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { settings } = useSettings();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setFormData(data);
    setFilteredDevices(allDevices);
    setFilteredNumbers(allNumbers);
    setEdit(forEdit); // Initially, show all devices
  }, [data, allDevices, allNumbers, forEdit]);

  const handleInputChange = (index: number, value: string) => {
    const updatedData = [...formData];
    updatedData[index] = value;
    setFormData(updatedData);

    // Ensure you are filtering the correct field index
    if (index === 2) {
      const filtered = allDevices.filter((device) =>
        device.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
    if (index === 5) {
      const filteredNumber = allNumbers.filter((number) =>
        number.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredNumbers(filteredNumber);
    }
  };

  const handleDeviceSelect = (index: number, device: string) => {
    handleInputChange(index, device);
    setFilteredDevices([]); // Clear the filtered list after selection
  };

  const handleNumberSelect = (index: number, device: string) => {
    handleInputChange(index, device);
    setFilteredNumbers([]); // Clear the filtered list after selection
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDateChange = (index: number, date: Date | null) => {
    if (date) {
      const isoDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
        .toISOString()
        .split("T")[0];
      handleInputChange(index, isoDate);
    } else {
      handleInputChange(index, ""); // Handle null date
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please Select a File!");
      return;
    }

    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setError("No authentication token found");
        return;
      }
      const tempformData = new FormData(); // Create a FormData object for the file upload
      tempformData.append("file", selectedFile);

      await axios.post(`${API_BASE_URL}/upload-rechnungen`, tempformData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update formData with the filename after successful upload
      const updatedData = [...formData];
      updatedData[formData.length - 1] = selectedFile.name; // Assuming last index is for the file name
      setFormData(updatedData);

      setSelectedFile(null);
      alert(
        "File uploaded successfully. Please update the file path in the Excel sheet."
      );
    } catch (err: any) {
      setError(
        "Error uploading file: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleUploadInvest = async () => {
    if (!selectedFile) {
      alert("Please Select a File!");
      return;
    }

    try {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setError("No authentication token found");
        return;
      }
      const tempformData = new FormData(); // Create a FormData object for the file upload
      tempformData.append("file", selectedFile);

      await axios.post(`${API_BASE_URL}/upload-invest`, tempformData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update formData with the filename after successful upload
      const updatedData = [...formData];
      updatedData[formData.length - 2] = selectedFile.name; // Assuming last index is for the file name
      setFormData(updatedData);

      setSelectedFile(null);
      alert(
        "File uploaded successfully. Please update the file path in the Excel sheet."
      );
    } catch (err: any) {
      setError(
        "Error uploading file: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const onDownload = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const fileName = formData[formData.length - 1];

      if (!authToken) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/download-rechnungen/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(
        "Error downloading file: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const onDownloadInvest = async () => {
    try {
      const authToken = localStorage.getItem("token");
      const fileName = formData[formData.length - 2];

      if (!authToken) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/download-invest/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(
        "Error downloading file: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (!isOpen) return null;

  const fields = [
    "ID",
    "Rechnungsnummer",
    "Artikelnummer",
    "Menge",
    "Gesamtbetrag",
    "Hard/Software",
    "Produktbezeichnung",
    "Zustand",
    "Bestelldatum",
    "Bestellt von",
    "Abteilung",
    "Bestellt für",
    "Investantrag",
    "Rechnungsdatei",
  ];

  const row1 = fields.slice(0, 4);
  const row2 = fields.slice(4);

  const renderInputField = (field: string, index: number) => {
    switch (field) {
      case "Bestelldatum":
        return (
          <DatePicker
            selected={
              formData[index] ? new Date(formData[index] + "T00:00:00Z") : null
            }
            onChange={(date) => handleDateChange(index, date)}
            className="w-full p-2 border border-gray-300 rounded"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date"
          />
        );
      case "Produktbezeichnung":
        return (
          <div className="relative">
            <input
              type="text"
              value={formData[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${field}`}
            />
            {/* Conditionally show filteredNumbers only when edit is false */}
            {edit === false && filteredDevices.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                {filteredDevices.map((device, i) => (
                  <li
                    key={i}
                    onClick={() => handleDeviceSelect(index, device)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {device}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Artikelnummer":
        return (
          <div className="relative">
            <input
              type="text"
              value={formData[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${field}`}
            />
            {/* Conditionally show filteredNumbers only when edit is false */}
            {edit === false && filteredNumbers.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                {filteredNumbers.map((number, i) => (
                  <li
                    key={i}
                    onClick={() => handleNumberSelect(index, number)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {number}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Bestellt von":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Select person</option>}
            {settings.orderedBy.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        );
      case "Zustand":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value=""></option>}
            {settings.conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        );
      case "Einzelpreis":
        return (
          <input
            type="text"
            value={formData[index] || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                handleInputChange(index, value);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="0.00"
          />
        );
      case "Abteilung":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Welche Abteilung</option>}
            {settings.departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        );
      case "Hard/Software":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Hard/Software</option>}
            {settings.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        );
      case "Rechnungsdatei":
        return (
          <>
            {formData[formData.length - 1] ? (
              <input
                type="text"
                value={formData[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
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
            )}
          </>
        );
      case "Investantrag":
        return (
          <>
            {formData[formData.length - 2] ? (
              <input
                type="text"
                value={formData[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <div className="mb-4 w-full max-w-4xl flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="px-4 py-2 border rounded w-full"
                />
                <button
                  onClick={handleUploadInvest}
                  className="px-4 py-2 bg-green-500 text-white rounded ml-2 hover:bg-green-700"
                >
                  Upload
                </button>
              </div>
            )}
          </>
        );
      default:
        return (
          <input
            type="text"
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[100vh] overflow-auto ">
        <h2 className="text-xl font-bold mb-4">Edit Data</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-2">
          {/* Render the first row of fields */}
          {row1.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium mb-1">{field}</label>
              {renderInputField(field, index)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Render the second row of fields */}
          {row2.map((field, index) => (
            <div key={index + row1.length} className="mb-4">
              <label className="block text-sm font-medium mb-1">{field}</label>
              {renderInputField(field, index + row1.length)}
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          {formData[formData.length - 1] && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download File
            </button>
          )}

          {formData[formData.length - 2] && (
            <button
              onClick={onDownloadInvest}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Investantrag herunterladen
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModalEinkauf;
