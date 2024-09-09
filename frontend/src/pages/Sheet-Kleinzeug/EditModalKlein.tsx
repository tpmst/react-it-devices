import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSettings } from "../../security/SettingsContex";

// Define the props for the EditModal component
interface EditModalProps {
  isOpen: boolean; // Determines if the modal is open
  onClose: () => void; // Function to close the modal
  data: string[]; // Data to be edited, passed as an array of strings
  onSave: (updatedData: string[]) => void; // Function to save the updated data
  allDevices: string[];
  forEdit: boolean; // List of all previously entered devices
}

// Define the EditModal component
const EditModalKlein: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  allDevices,
  forEdit,
}) => {
  // State to hold the form data being edited
  const [formData, setFormData] = useState<string[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<string[]>([]);
  const { settings } = useSettings();
  const [edit, setEdit] = useState(false); // State to hold all unique devices

  // Effect hook to update formData whenever the data prop changes
  useEffect(() => {
    setFormData(data);
    setFilteredDevices(allDevices);
    setEdit(forEdit); // Initially, show all devices
  }, [data, allDevices, forEdit]);

  // Handle text input changes
  const handleInputChange = (index: number, value: string) => {
    const updatedData = [...formData];
    updatedData[index] = value;
    setFormData(updatedData);

    // If the field being edited is the 'Gerät' field, filter the devices
    if (index === 2) {
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

  // Handle date changes using the DatePicker component
  const handleDateChange = (index: number, date: Date | null) => {
    if (date) {
      const isoDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
        .toISOString()
        .split("T")[0];
      handleInputChange(index, isoDate);
    } else {
      handleInputChange(index, ""); // Handle the case where date is null
    }
  };

  // Handle form submission and close the modal
  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  // If the modal isn't open, return null (don't render anything)
  if (!isOpen) return null;

  // Fields to be displayed in the form
  const fields = [
    "ID",
    "Ausgabedatum",
    "Gerät",
    "Empfänger",
    "Herausgegeben von",
    "Rückgabedatum",
    "Entgegengenommen von",
  ];

  // Split the fields into two rows for easier form layout
  const row1 = fields.slice(0, 3); // First row fields up to "Gerät"
  const row2 = fields.slice(3); // Second row fields after "Gerät"

  // Function to render each input field based on the field type
  const renderInputField = (field: string, index: number) => {
    switch (field) {
      // Render a DatePicker for date fields
      case "Ausgabedatum":
      case "Rückgabedatum":
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
      // Render a text input with dropdown for device selection
      case "Gerät":
        return (
          <div className="relative">
            <input
              type="text"
              value={formData[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter device"
            />
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
      // Render a dropdown for "Herausgegeben von" and "Entgegengenommen von" selection
      case "Herausgegeben von":
      case "Entgegengenommen von":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value=""></option>}
            {settings.orderedBy.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        );
      // Default case for rendering a standard text input
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

export default EditModalKlein;
