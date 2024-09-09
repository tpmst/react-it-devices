import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_BASE_URL } from "../../security/config";
import { useSettings } from "../../security/SettingsContex";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string[];
  onSave: (updatedData: string[]) => void;
  allDevices: string[];
  forEdit: boolean; // List of all previously entered devices
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  allDevices,
  forEdit,
}) => {
  const [formData, setFormData] = useState<string[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings(); // State for managing errors
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setFormData(data);
    setFilteredDevices(allDevices);
    setEdit(forEdit); // Initially, show all devices
  }, [data, allDevices, forEdit]);

  const handleInputChange = (index: number, value: string) => {
    const updatedData = [...formData];
    updatedData[index] = value;
    setFormData(updatedData);

    // If the field being edited is the 'Bezeichnung des Produktes' field, filter the devices
    if (index === 7) {
      const filtered = allDevices.filter((device) =>
        device.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDevices(filtered);
    }
  };

  // Handle selecting a device from the filtered list
  const handleDeviceSelect = (index: number, device: string) => {
    handleInputChange(index, device);
    setFilteredDevices([]); // Clear the filtered list after selection
  };

  const handleDateChange = (index: number, date: Date | null) => {
    if (date) {
      // Convert the date to a string in the format 'YYYY-MM-DD' without timezone issues
      const isoDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
        .toISOString()
        .split("T")[0];
      handleInputChange(index, isoDate);
    } else {
      handleInputChange(index, ""); // Handle the case where the date is null
    }
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const onUnsignedDownload = async () => {
    try {
      const authToken = localStorage.getItem("token"); // Retrieve auth token
      const [ID, date, , , requester, , , product, , , , , , ,] = formData; // Assuming the file name is in the last field
      const fileName = `${ID}-${date}-${requester}-${product}.pdf`;
      if (!authToken) {
        setError("No authentication token found");
        return;
      }

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

  const onDownload = async () => {
    try {
      const authToken = localStorage.getItem("token"); // Retrieve auth token
      const fileName = formData[formData.length - 1]; // Assuming the file name is in the last field

      if (!authToken) {
        setError("No authentication token found");
        return;
      }

      // Make an API call to download the file
      const response = await axios.get(
        `${API_BASE_URL}/download-signed/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass the token in the Authorization header
          },
          responseType: "blob", // Fetch the file as binary large object (BLOB)
        }
      );

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

  if (!isOpen) return null;

  const fields = [
    "ID",
    "Antragsdatum",
    "Hard/Software",
    "Abteilung",
    "Empfänger",
    "Bestellt von (IT)",
    "Bezeichnung des Produktes", // The field for device/product name
    "S/N",
    "Betriebsmittel",
    "Zubehör",
    "Besonderheiten/Mängel",
    "File-Name - (nur ändern wenn die unterschriebene Datei hinzugefügt wurde)",
  ];

  const row1 = fields.slice(0, 12);
  const row2 = fields.slice(12);

  const renderInputField = (field: string, index: number) => {
    switch (field) {
      case "Antragsdatum":
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
      case "Bestellt von (IT)":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Bestellt von</option>}
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
            {!formData[index] && <option value="">Zustand</option>}
            {settings.conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        );
      case "Betriebsmittel":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && (
              <option value="">Betriebsmittel aussuchen</option>
            )}
            {settings.betriebsmittel.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
        );
      case "Bezeichnung des Produktes":
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
      <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[100vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Edit Data</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 gap-2">
          {row1.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium mb-1">{field}</label>
              {renderInputField(field, index)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {row2.map((field, index) => (
            <div key={index + row1.length} className="mb-4">
              <label className="block text-sm font-medium mb-1">{field}</label>
              {renderInputField(field, index + row1.length)}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          {formData[formData.length - 1] ? (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download signed File
            </button>
          ) : (
            <button
              onClick={onUnsignedDownload}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Download unsigned File
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

export default EditModal;
