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
import { useTranslation } from "react-i18next"; // Import useTranslation

interface Link {
  text: string;
  url: string;
}

interface Settings {
  standardHardware: { item: string; links: Link[] }[];
}

const StandardHardware = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [newItem, setNewItem] = useState<string>(""); // State for new hardware item
  const [newLink, setNewLink] = useState<Link>({ text: "", url: "" }); // State for new links in standardHardware
  const { settings, updateSettings, loading, error } = useSettings();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null); // Local state for editing

  useEffect(() => {
    if (settings) {
      // Überprüfe, ob alle Felder korrekt initialisiert sind
      setLocalSettings((prevSettings) => ({
        ...prevSettings, // Kopiere vorhandene Einstellungen
        orderedBy: settings.orderedBy, // Füge Standardwerte hinzu, falls undefined
        betriebsmittel: settings.betriebsmittel,
        departments: settings.departments,
        categories: settings.categories,
        conditions: settings.conditions,
        standardHardware: settings.standardHardware || [], // Standardwert für standardHardware
      }));
    }
  }, [settings]);

  // Handle input change for a specific hardware item
  const handleInputChange = (index: number, value: string) => {
    if (!localSettings) return;

    const updatedStandardHardware = [...localSettings.standardHardware];
    updatedStandardHardware[index].item = value; // Update only the specific item

    setLocalSettings({
      ...localSettings,
      standardHardware: updatedStandardHardware,
    });
  };

  // Handle adding new standardHardware item
  const handleAddItem = () => {
    if (!localSettings || !newItem) return;

    const updatedStandardHardware = [
      ...localSettings.standardHardware,
      { item: newItem, links: [] }, // Add new item with an empty links array
    ];

    setLocalSettings({
      ...localSettings,
      standardHardware: updatedStandardHardware,
    });
    setNewItem(""); // Clear the input field for new item
  };

  // Handle removing a standardHardware item
  const handleRemoveItem = (index: number) => {
    if (!localSettings) return;

    const updatedStandardHardware = [...localSettings.standardHardware];
    updatedStandardHardware.splice(index, 1); // Remove specific item

    setLocalSettings({
      ...localSettings,
      standardHardware: updatedStandardHardware,
    });
  };

  // Handle adding a new link to a specific standardHardware item
  const handleAddLink = (index: number) => {
    if (!localSettings || !newLink.text || !newLink.url) return;

    const updatedStandardHardware = [...localSettings.standardHardware];
    updatedStandardHardware[index].links = [
      ...updatedStandardHardware[index].links,
      newLink,
    ]; // Add new link to the specific item

    setLocalSettings({
      ...localSettings,
      standardHardware: updatedStandardHardware,
    });
    setNewLink({ text: "", url: "" }); // Clear link inputs
  };

  // Handle removing a link from a specific standardHardware item
  const handleRemoveLink = (itemIndex: number, linkIndex: number) => {
    if (!localSettings) return;

    const updatedStandardHardware = [...localSettings.standardHardware];
    updatedStandardHardware[itemIndex].links.splice(linkIndex, 1); // Remove specific link

    setLocalSettings({
      ...localSettings,
      standardHardware: updatedStandardHardware,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localSettings) {
      updateSettings(localSettings); // Send the updated settings to the backend and global state
    }
  };

  if (loading) return <div>{t("status.loading")}</div>;
  if (error)
    return (
      <div className="text-red-500">
        {t("error.general")}: {error}
      </div>
    );

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          {localSettings &&
            localSettings.standardHardware.map(
              (itemObj: { item: string; links: Link[] }, index: number) => (
                <div key={index} className="flex justify-center mr-4 mb-4">
                  <Card variant="outlined">
                    <CardContent>
                      {/* Standard Hardware Item */}
                      <div className="mb-2 flex items-center">
                        <TextField
                          variant="outlined"
                          value={itemObj.item}
                          onChange={(e) =>
                            handleInputChange(index, e.target.value)
                          } // Update only the relevant item
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <IconButton onClick={() => handleRemoveItem(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>

                      {/* Links for the current item */}
                      <Typography variant="body1" component="h3">
                        {t("standardHardware.links")}
                      </Typography>
                      {itemObj.links.map((link, linkIndex) => (
                        <div key={linkIndex} className="mb-2 flex items-center">
                          <TextField
                            variant="outlined"
                            value={link.text}
                            placeholder={t("standardHardware.linkText")}
                            fullWidth
                            sx={{ mr: 2 }}
                            disabled
                          />
                          <TextField
                            variant="outlined"
                            value={link.url}
                            placeholder={t("standardHardware.linkUrl")}
                            fullWidth
                            sx={{ mr: 2 }}
                            disabled
                          />
                          <IconButton
                            onClick={() => handleRemoveLink(index, linkIndex)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ))}

                      {/* Add new link to item */}
                      <div className="mb-2 flex items-center">
                        <TextField
                          variant="outlined"
                          value={newLink.text}
                          onChange={(e) =>
                            setNewLink({ ...newLink, text: e.target.value })
                          }
                          placeholder={t("standardHardware.linkText")}
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <TextField
                          variant="outlined"
                          value={newLink.url}
                          onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                          }
                          placeholder={t("standardHardware.linkUrl")}
                          fullWidth
                          sx={{ mr: 2 }}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => handleAddLink(index)}
                        >
                          <AddIcon />
                        </IconButton>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
        </Grid>

        {/* Add new item input */}
        <div className="mt-3 flex items-center">
          <TextField
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t("standardHardware.addItemPlaceholder")}
            fullWidth
            sx={{ mr: 2 }}
          />
          <IconButton color="primary" onClick={handleAddItem}>
            <AddIcon />
          </IconButton>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          {t("standardHardware.saveSettings")}
        </Button>
      </form>
    </div>
  );
};

export default StandardHardware;
