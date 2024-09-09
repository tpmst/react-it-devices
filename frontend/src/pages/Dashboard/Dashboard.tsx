import Grid from "@mui/material/Grid"; // Import the MUI Grid component
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import GraphBestand from "./grahps-bestand";
import GraphKrimsKrams from "./graphs-krimskrams";
import DashboardCard from "../../components/dashboard/dashboardCard";
import { API_BASE_URL } from "../../security/config";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [totalHardwarePrice, setTotalHardwarePrice] = useState<number>(0); // Total hardware price
  const [percntageLastMonth, setPercntageLastMonth] = useState<string>("");
  const [PriceLastMonth, setPriceLastMonth] = useState<number>(0);
  const [percntageLastYear, setPercntageLastYear] = useState<string>("");
  const [krimskramsLastYear, setKrimskramsLastYear] = useState<string>("");
  const [PriceLastYear, setPriceLastYear] = useState<number>(0);
  const [authToken, setAuthToken] = useState<string | null>(null); // Authentication token
  // Effect hook to fetch CSV data on component mount or when selectedYear changes
  useEffect(() => {
    // Get the authentication token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Set token in state
    } else {
      return;
    }

    // Function to fetch the CSV file from the server
    const fetchCSVFile = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/download-csv/03_it-einkauf.csv`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text", // Fetch as plain text
          }
        );

        const parsedData = parseCSV(response.data); // Parse the CSV data
        calculateTotalPrices(parsedData); // Calculate total hardware and software prices
        calculateYearlySpending(parsedData); // Calculate spending by department
        calculateMonthlySpending(parsedData); // Calculate monthly spending for the selected year

        const responseKrimskrams = await axios.get(
          `${API_BASE_URL}/download-csv/02_it-kleinZeug.csv`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text", // Fetch as plain text
          }
        );

        const parsedData1 = parseCSV(responseKrimskrams.data); // Parse the CSV data
        calculateUserHardwareSpending(parsedData1); // Calculate total hardware and software prices
      } catch (error: any) {
        return;
      }
    };

    fetchCSVFile(); // Call the function to fetch CSV data
  }, [authToken]); // Re-run the effect if authToken or selectedYear changes

  // Function to parse CSV data into a 2D array of strings
  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(";"));
    return rows;
  };

  const calculateUserHardwareSpending = (data: string[][]) => {
    let userHardwareCount = 0;
    const currentYear = new Date().getFullYear(); // Aktuelles Jahr ermitteln

    data.slice(1).forEach((row) => {
      const dateString = row[1]; // Datum in Spalte 1 (Index 0)
      const date = new Date(dateString); // Datum parsen

      if (date.getFullYear() === currentYear) {
        // Wenn das Jahr dem aktuellen Jahr entspricht
        userHardwareCount += 1; // Erhöhe die Anzahl der ausgegebenen Geräte
      }
    });

    // Ausgabe des Ergebnisses in lesbarer Form
    console.log(JSON.stringify(userHardwareCount, null, 2));

    setKrimskramsLastYear(`${userHardwareCount}`);
  };

  // Function to calculate total prices for hardware and software
  const calculateTotalPrices = (data: string[][]) => {
    let Total = 0;

    data.slice(1).forEach((row) => {
      const price = parseFloat(row[4]); // Assuming "Preis" is in column index 9

      if (!isNaN(price)) {
        Total += price; // Add to hardware total
      }
    });

    setTotalHardwarePrice(Total); // Update state with total hardware price
  };

  const calculateYearlySpending = (data: string[][]) => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    let currentYearSpending = 0;
    let lastYearSpending = 0;

    data.slice(1).forEach((row) => {
      const date = row[8]?.trim(); // Assuming "Antragsdatum" is in column index 8
      const price = parseFloat(row[4]?.replace(",", ".").trim()); // Assuming "Preis" is in column index 4

      // Ensure both date and price are valid
      if (date && !isNaN(price)) {
        const [yearPart] = date.split("-"); // Assuming "YYYY-MM-DD" format
        const year = parseInt(yearPart, 10);

        if (year === currentYear) {
          currentYearSpending += price; // Add price to current year's total
        } else if (year === lastYear) {
          lastYearSpending += price; // Add price to last year's total
        }
      }
    });

    // Calculate percentage change (handle division by zero)
    let percentageChange = 0;
    if (lastYearSpending !== 0) {
      percentageChange =
        ((currentYearSpending - lastYearSpending) / lastYearSpending) * 100;
    } else if (currentYearSpending > 0) {
      percentageChange = 100; // If last year was 0 and this year is positive
    }
    // Set the formatted percentage string
    if (percentageChange <= 0) {
      setPercntageLastYear(`-${percentageChange.toFixed(2)}% zum letzten Jahr`);
    } else {
      setPercntageLastYear(`+${percentageChange.toFixed(2)}% zum letzten Jahr`);
    }

    // Update the state with the yearly spending data
    setPriceLastYear(currentYearSpending);
  };

  // Function to calculate monthly spending for a given year
  const calculateMonthlySpending = (data: string[][]) => {
    const currentYear = new Date().getFullYear();
    const monthlySpending = Array(12).fill(0); // Initialize monthly spending array

    data.slice(1).forEach((row) => {
      const date = row[8]?.trim(); // Assuming "Antragsdatum" is in column index 8
      const price = parseFloat(row[4]?.replace(",", ".").trim()); // Assuming "Preis" is in column index 4

      // Ensure both date and price are valid
      if (date && !isNaN(price)) {
        const [yearPart, monthPart] = date.split("-"); // Assuming "YYYY-MM-DD" format
        if (parseInt(yearPart, 10) === currentYear) {
          const month = parseInt(monthPart, 10) - 1; // Convert month to 0-based index
          if (month >= 0 && month < 12) {
            // Ensure valid month index
            monthlySpending[month] += price; // Add price to the corresponding month
          }
        }
      }
    });

    // Get the current month and previous month spending
    const currentMonth = new Date().getMonth(); // 0-based index for the current month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle wrap-around for January

    const currentMonthSpending = monthlySpending[currentMonth];
    const lastMonthSpending = monthlySpending[lastMonth];

    // Calculate the percentage change (handle division by zero)
    let percentageChange = 0;
    if (lastMonthSpending !== 0) {
      percentageChange =
        ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
    } else if (currentMonthSpending > 0) {
      percentageChange = 100; // If last month was 0 and this month is positive
    }
    // Return spending and percentage change
    if (percentageChange <= 0) {
      let newString1 =
        "-" + percentageChange.toFixed(2) + "% zum letzten Monat";
      setPercntageLastMonth(newString1);
    } else {
      let newString2 =
        "+" + percentageChange.toFixed(2) + "% zum letzten Monat";
      setPercntageLastMonth(newString2);
    }

    setPriceLastMonth(currentMonthSpending);
  };

  return (
    <div className="p-6 bg-white dark:bg-[#11151a]">
      {/* Cards Section */}
      <Grid container spacing={4}>
        {/* Render four cards in a row */}
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Gesamtausgaben"
            value={`${totalHardwarePrice}€`}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Ausgaben dieses Jahr"
            value={`${PriceLastYear}€`}
            percentage={percntageLastYear}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Ausgaben in diesem Monat"
            value={`${PriceLastMonth}€`}
            percentage={percntageLastMonth}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Herausgegebene Kleingeräte dieses Jahr"
            value={krimskramsLastYear}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <List>
        <ListItem>
          <GraphBestand />
        </ListItem>
      </List>
      <Divider className="bg-gray-700 dark:bg-gray-200" />
      <List>
        <ListItem>
          <GraphKrimsKrams />
        </ListItem>
      </List>
    </div>
  );
};

export default Dashboard;
