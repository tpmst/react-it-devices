import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import SelectSettings from "./SelectSettings";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook
import StandardHardware from "./StandardHardware";

// Dashboard component for displaying settings
const SettingsLayout = () => {
  const { t } = useTranslation(); // Use translation hook

  return (
    <div>
      <div className="flex items-center justify-center pt-3 pr-4">
        <h1 className="text-3xl font-semibold">{t("settings.title")}</h1>
      </div>
      <List>
        <ListItem>
          <SelectSettings />
        </ListItem>
        <ListItem>
          <StandardHardware />
        </ListItem>
      </List>
      <Divider />
    </div>
  );
};

export default SettingsLayout;
