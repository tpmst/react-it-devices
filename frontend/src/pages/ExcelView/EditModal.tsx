import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string[];
  onSave: (updatedData: string[]) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<string[]>([]);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleInputChange = (index: number, value: string) => {
    const updatedData = [...formData];
    updatedData[index] = value;
    setFormData(updatedData);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const fields = [
    "ID",
    "Antragsdatum",
    "Hard/Software",
    "Abteilung",
    "Besteller",
    "Bestellt von (IT)",
    "Bestelldatum",
    "Bezeichnung des Produktes",
    "S/N",
    "Preis",
    "Gebraucht",
    "Liferant",
    "Liferdatum",
    "Zustand",
    "Gen. Vorgesetzter",
    "Vorgesetzter",
    "Betriebsmittel",
    "Zubehör",
    "Besonderheiten/Mängel",
    "File-Name",
  ];

  // Dropdown options for specific fields
  const departments = [
    "Buchhaltung",
    "Callcenter",
    "Einkauf",
    "Geschäftsführung",
    "IT-Abteilung",
    "Marketing",
    "Medizin & Kommunikation",
    "Personal",
  ];
  const categories = ["Hardware", "Software"];
  const orderedBy = ["N. Pischel", "T. Stiefel"];
  const conditions = ["Neu", "In Ordnung", "beschädigt"];
  const usedOptions = ["Ja", "Nein"];
  const specialRequests = ["Ja", "Nein"];
  const accessories = [
    "Notebook",
    "Tablet",
    "Mobiltelefon",
    "Speichergerät",
    "Sonstige",
  ];

  const row1 = fields.slice(0, 12); // First row fields
  const row2 = fields.slice(12); // Second row fields

  const renderInputField = (field: string, index: number) => {
    switch (field) {
      case "Abteilung":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Welche Abteilung</option>}
            {departments.map((dept) => (
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        );
      case "Bestellt von (IT)":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Bestellt von</option>}
            {orderedBy.map((person) => (
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
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        );
      case "Gebraucht":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && <option value="">Gebraucht?</option>}
            {usedOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "Gen. Vorgesetzter":
        return (
          <select
            value={formData[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            {!formData[index] && (
              <option value="">Gen. durch Vorgesetzter?</option>
            )}
            {specialRequests.map((option) => (
              <option key={option} value={option}>
                {option}
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
            {accessories.map((acc) => (
              <option key={acc} value={acc}>
                {acc}
              </option>
            ))}
          </select>
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
        <div className="grid grid-cols-2 gap-2">
          {/* First Row of Fields */}
          {row1.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium mb-1">{field}</label>
              {renderInputField(field, index)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Second Row of Fields */}
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

export default EditModal;
