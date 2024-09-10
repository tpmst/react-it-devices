import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Zaelerstaende from "./Zählerstände";
import Tonerlevels from "./Tonerstände";
import NormalCard from "../../components/dashboard/normalCrard";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

// Dashboard component for displaying financial data in charts
const DruckerDashboard = () => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <div>
      <Divider />

      <div className="flex flex-row justify-around p-4">
        <div>
          <NormalCard title={t("dashboard.counterLevels")}>
            <List>
              <ListItem>
                <Zaelerstaende />
              </ListItem>
            </List>
          </NormalCard>
        </div>
        <div>
          <NormalCard title={t("dashboard.tonerLevels")}>
            <List>
              <ListItem>
                <Tonerlevels />
              </ListItem>
            </List>
          </NormalCard>
        </div>
      </div>
    </div>
  );
};

export default DruckerDashboard;
