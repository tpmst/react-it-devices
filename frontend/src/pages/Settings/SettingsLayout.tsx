import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import SelectSettings from "./SelectSettings";

// Dashboard component for displaying financial data in charts
const SettingsLayout = () => {
  // State variables
  return (
    <div>
      <div className="flex items-center justify-center pt-3 pr-4">
        <h1 className="text-3xl font-semibold">Einstellungen</h1>
      </div>
      <List>
        <ListItem>
          <SelectSettings></SelectSettings>
        </ListItem>
      </List>
      <Divider></Divider>
    </div>
  );
};

export default SettingsLayout;
