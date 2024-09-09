import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Zaelerstaende from "./Zählerstände";
import Tonerlevels from "./Tonerstände";
import NormalCard from "../../components/dashboard/normalCrard";

// Dashboard component for displaying financial data in charts
const DruckerDashboard = () => {
  return (
    <div>
      <Divider />

      <div className="flex flex-row justify-around p-4">
        <div>
          <NormalCard title="Zählerstände">
            <List>
              <ListItem>
                <Zaelerstaende />
              </ListItem>
            </List>
          </NormalCard>
        </div>
        <div>
          <NormalCard title="Tonerstände">
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
