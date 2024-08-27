import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts";
import CardComponent from "../../components/cardComponent";

const Dashboard = () => {
  const [data, setData] = useState<string[][]>([]);
  const [totalHardwarePrice, setTotalHardwarePrice] = useState<number>(0);
  const [totalSoftwarePrice, setTotalSoftwarePrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [departmentSpending, setDepartmentSpending] = useState<
    Record<string, number>
  >({});
  const [monthlySpending, setMonthlySpending] = useState<number[]>(
    Array(12).fill(0)
  ); // Array for each month
  const [width, setWidth] = useState(400);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No token found, please log in.");
      return;
    }

    const fetchCSVFile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/download-csv/01_it-beschaffung.csv",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "text", // Fetches the file as plain text
          }
        );

        const parsedData = parseCSV(response.data);
        setData(parsedData);

        calculateTotalPrices(parsedData);
        calculateDepartmentSpending(parsedData);
        calculateMonthlySpending(parsedData);
      } catch (error: any) {
        setError(
          `Error fetching CSV file: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCSVFile();
  }, [authToken]);

  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(";"));
    return rows;
  };

  const calculateTotalPrices = (data: string[][]) => {
    let hardwareTotal = 0;
    let softwareTotal = 0;

    data.slice(1).forEach((row) => {
      const category = row[2]; // Assuming the "Hard/Software" category is in column index 2
      const price = parseFloat(row[9].replace(",", ".")); // Assuming "Preis" is in column index 9

      if (!isNaN(price)) {
        if (category === "Hardware") {
          hardwareTotal += price;
        } else if (category === "Software") {
          softwareTotal += price;
        }
      }
    });

    setTotalHardwarePrice(hardwareTotal);
    setTotalSoftwarePrice(softwareTotal);
  };

  const calculateDepartmentSpending = (data: string[][]) => {
    const spending: Record<string, number> = {};

    data.slice(1).forEach((row) => {
      const department = row[3]; // Assuming the department is in column index 3
      const price = parseFloat(row[9].replace(",", ".")); // Assuming "Preis" is in column index 9

      if (!isNaN(price)) {
        if (!spending[department]) {
          spending[department] = 0;
        }
        spending[department] += price;
      }
    });

    setDepartmentSpending(spending);
  };

  const calculateMonthlySpending = (data: string[][]) => {
    const monthlySpending = Array(12).fill(0); // Initialize array for 12 months

    data.slice(1).forEach((row) => {
      const date = row[1]; // Assuming "Antragsdatum" is in column index 1
      const price = parseFloat(row[9].replace(",", ".")); // Assuming "Preis" is in column index 9

      if (date && !isNaN(price)) {
        const month = parseInt(date.split(".")[1], 10) - 1; // Extract month (1-based index)
        monthlySpending[month] += price; // Add the price to the corresponding month
      }
    });

    setMonthlySpending(monthlySpending);
  };

  const departmentNames = Object.keys(departmentSpending);
  useEffect(() => {
    const baseWidth = 350;
    const additionalWidth = 75;
    const newChartWidth = baseWidth + departmentNames.length * additionalWidth;
    setWidth(newChartWidth);
  }, [departmentSpending]); // Calculate chart width based on department spending
  const departmentTotals = departmentNames.map(
    (dept) => departmentSpending[dept]
  );

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      <div className="flex flex-wrap justify-start gap-5 p-4">
        <div className="p-2">
          <CardComponent title="Gesamtausgaben für Hard/Software">
            <div>
              <BarChart
                xAxis={[
                  {
                    id: "barCategories",
                    data: ["Hardware", "Software"],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    id: "totalPrice",
                    data: [totalHardwarePrice, totalSoftwarePrice],
                  },
                ]}
                width={400}
                height={250}
              />

              <p>Total Hardware Price: {totalHardwarePrice.toFixed(2)} €</p>
              <p>Total Software Price: {totalSoftwarePrice.toFixed(2)} €</p>
            </div>
          </CardComponent>
        </div>
        <div className="p-6">
          <CardComponent title="Monatliche Ausgaben">
            <div>
              <BarChart
                xAxis={[
                  {
                    id: "months",
                    data: [
                      "Januar",
                      "Februar",
                      "März",
                      "April",
                      "Mai",
                      "Juni",
                      "Juli",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    id: "monthlySpending",
                    data: monthlySpending,
                  },
                ]}
                width={900}
                height={250}
              />
            </div>
          </CardComponent>
        </div>
      </div>
      <div className="w-full p-6">
        <CardComponent title="Gesamtausgaben der Abteilungen">
          <div>
            <BarChart
              xAxis={[
                {
                  id: "departments",
                  data: departmentNames,
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  id: "totalSpending",
                  data: departmentTotals,
                },
              ]}
              width={width}
              height={250}
            />

            <div>
              {departmentNames.map((dept, index) => (
                <p key={dept}>
                  {dept}: {departmentSpending[dept].toFixed(2)} €
                </p>
              ))}
            </div>
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default Dashboard;
