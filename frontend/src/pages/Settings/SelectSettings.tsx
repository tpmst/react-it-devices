import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSettings } from "../../security/SettingsContex";

interface Settings {
  orderedBy: string[];
  betriebsmittel: string[];
  departments: string[];
  categories: string[];
  conditions: string[];
}

const SelectSettings = () => {
  const [newItem, setNewItem] = useState<Record<keyof Settings, string>>({
    orderedBy: "",
    betriebsmittel: "",
    departments: "",
    categories: "",
    conditions: "",
  }); // State for new items being added
  const { settings, updateSettings, loading, error } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null); // Local state for editing

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings); // Sync local state with global settings
    }
  }, [settings]);

  const handleInputChange = (
    field: keyof Settings,
    index: number,
    value: string
  ) => {
    if (!localSettings) return;

    const updated = { ...localSettings };
    updated[field][index] = value;
    setLocalSettings(updated);
  };

  // Handle adding new item to a specific field
  const handleAddItem = (field: keyof Settings) => {
    if (!localSettings || !newItem[field]) return;

    const updatedSettings = { ...localSettings };
    updatedSettings[field] = [...updatedSettings[field], newItem[field]];

    setLocalSettings(updatedSettings);
    setNewItem({ ...newItem, [field]: "" }); // Clear the input field for new item
  };

  // Handle removing an item from a specific field
  const handleRemoveItem = (field: keyof Settings, index: number) => {
    if (!localSettings) return;

    const updatedSettings = { ...localSettings };
    updatedSettings[field].splice(index, 1);

    setLocalSettings(updatedSettings);
  };

  // Handle form submission to save the settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localSettings) {
      updateSettings(localSettings); // Send the updated settings to the backend and global state
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {/* For each setting, we'll create a grid item */}
          {Object.keys(localSettings || {}).map((field) => (
            <div className="flex justify-center mr-4" key={field}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Typography>
                  {localSettings &&
                    (localSettings as any)[field].map(
                      (item: string, index: number) => (
                        <div key={index} className="mb-2 flex items-center">
                          <TextField
                            variant="outlined"
                            value={item}
                            onChange={(e) =>
                              handleInputChange(
                                field as keyof Settings,
                                index,
                                e.target.value
                              )
                            }
                            fullWidth
                            sx={{ mr: 2 }}
                          />
                          <IconButton
                            onClick={() =>
                              handleRemoveItem(field as keyof Settings, index)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )
                    )}

                  {/* Add new item input */}
                  <div className="mb-2 flex items-center">
                    <TextField
                      variant="outlined"
                      value={newItem[field as keyof Settings]}
                      onChange={(e) =>
                        setNewItem({ ...newItem, [field]: e.target.value })
                      }
                      placeholder={`Add new ${field}`}
                      fullWidth
                      sx={{ mr: 2 }}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => handleAddItem(field as keyof Settings)}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Save Settings
        </Button>
      </form>
    </div>
  );
};

export default SelectSettings;
