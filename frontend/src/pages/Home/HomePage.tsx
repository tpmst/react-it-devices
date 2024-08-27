import React, { useState } from "react";
import CSVViewer from "../ExcelView/CSVView";
import ListPDF from "../pdf/ListPdf";
import Dashboard from "../Dashboard/grahps";

const HomePage: React.FC = () => {
  const [site, setSite] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-blue-500 w-full p-4 text-white text-center text-2xl font-bold">
        <button onClick={() => setSite("dashboard")} className="mr-10">
          Dashboard
        </button>
        <button onClick={() => setSite("xlsx")} className="mr-10">
          Excel-Sheet
        </button>
        <button onClick={() => setSite("pdf")}>PDF Files</button>
      </header>

      <main className="flex-grow flex flex-col p-4 w-full">
        {site === "dashboard" && <Dashboard />}
        {site === "pdf" && <ListPDF />}
        {site === "xlsx" && <CSVViewer />}
      </main>
      <footer className="bg-gray-800 w-full p-4 text-white text-center">
        © 2024 Certmedica. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
