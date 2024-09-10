import React, { useEffect, useState } from "react";
import CSVViewer from "../ExcelView/CSVView";
import ListPDF from "../pdf/ListPdf";
import Dashboard from "../Dashboard/Dashboard";
import MenuDrawer from "../../components/menuDrawer";
import CSVViewKlein from "../Sheet-Kleinzeug/CSVViewKlein";
import DruckerDashboard from "../druckerDashboard/DruckerDashboard";
import CSVViewEinkauf from "../Einkauf/CSVViewEinkauf";
import SettingsLayout from "../Settings/SettingsLayout";
import { SettingsProvider } from "../../security/SettingsContex";
import ThemeSelector from "../../context/themeSelector";

const HomePage: React.FC = () => {
  const [site, setSite] = useState("dashboard");

  useEffect(() => {});

  return (
    <div className="min-h-screen bg-[#f5f4eb] dark:bg-[#1c242c] flex flex-col items-center justify-center">
      <header className="bg-[#eceadb] dark:bg-[#1e293b] flex w-full p-4 text-2xl font-bold items-center">
        <div className="flex-start">
          <MenuDrawer setSite={setSite} />
        </div>
        <div className="ml-auto">
          {" "}
          <ThemeSelector />
        </div>
      </header>

      <SettingsProvider>
        <main className="flex-grow flex flex-col p-4 w-full pl-24 relative">
          {site === "dashboard" && <Dashboard />}
          {site === "pdf" && <ListPDF />}
          {site === "xlsx" && <CSVViewer />}
          {site === "tabelle" && <CSVViewKlein />}
          {site === "drucker" && <DruckerDashboard></DruckerDashboard>}
          {site === "einkauf" && <CSVViewEinkauf />}
          {site === "settings" && <SettingsLayout />}
        </main>
      </SettingsProvider>
      <footer className="bg-[#eceadb] dark:bg-[#1e293b] w-full p-4 dark:text-white text-center">
        © 2024 tpmst. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
