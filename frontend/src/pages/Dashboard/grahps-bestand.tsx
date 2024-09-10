import { useState, useEffect } from "react";
import axios from "axios";
import { axisClasses, BarChart } from "@mui/x-charts";
import { API_BASE_URL } from "../../security/config";
import NormalCard from "../../components/dashboard/normalCrard";
import { useTheme } from "../../context/themeContext";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

// Dashboard component for displaying financial data in charts
const GraphBestand = () => {
  const { t } = useTranslation(); // Use the `useTranslation` hook

  // State variables
  const [totalHardwarePrice, setTotalHardwarePrice] = useState<number>(0); // Total hardware price
  const [totalSoftwarePrice, setTotalSoftwarePrice] = useState<number>(0); // Total software price
  const [error, setError] = useState<string | null>(null); // Error message
  const [authToken, setAuthToken] = useState<string | null>(null); // Authentication token
  const [departmentSpending, setDepartmentSpending] = useState<
    Record<string, { totalSpending: number; itemCount: number }>
  >({}); // Spending by department
  const [monthlySpending, setMonthlySpending] = useState<number[]>(
    Array(12).fill(0)
  ); // Spending by month
  const [width, setWidth] = useState(400); // Chart width
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  ); // Selected year for filtering data
  const [availableYears, setAvailableYears] = useState<number[]>([]); // Available years in the CSV data
  const { theme } = useTheme(); // Get the current theme from the ThemeProvider

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // Set token in state
    } else {
      setError(t("error.noToken")); // Use translation for error message
      return;
    }

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

        const uniqueYears = extractUniqueYears(parsedData); // Extract unique years from data
        setAvailableYears(uniqueYears); // Set available years in state

        calculateTotalPrices(parsedData); // Calculate total hardware and software prices
        calculateDepartmentSpending(parsedData); // Calculate spending by department
        calculateMonthlySpending(parsedData, selectedYear); // Calculate monthly spending for the selected year
      } catch (error: any) {
        setError(
          `${t("error.fetchCSV")} ${
            error.response?.data?.message || error.message
          }`
        );
      }
    };

    fetchCSVFile(); // Call the function to fetch CSV data
  }, [authToken, selectedYear, t]); // Re-run the effect if authToken, selectedYear, or translation changes

  const parseCSV = (text: string): string[][] => {
    const rows = text.split("\n").map((row) => row.split(";"));
    return rows;
  };

  const extractUniqueYears = (data: string[][]): number[] => {
    const years = new Set<number>();

    data.slice(1).forEach((row) => {
      const date = row[8]; // Assuming "Antragsdatum" is in column index 1
      if (date) {
        const year = parseInt(date.split("-")[0], 10);
        if (!isNaN(year)) {
          years.add(year); // Add the year to the set
        }
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Convert set to array and sort in descending order
  };

  const calculateTotalPrices = (data: string[][]) => {
    let hardwareTotal = 0;
    let softwareTotal = 0;

    data.slice(1).forEach((row) => {
      const category = row[5]; // Assuming the "Hard/Software" category is in column index 2
      const price = parseFloat(row[4]); // Assuming "Preis" is in column index 9

      if (!isNaN(price)) {
        if (category === "Hardware") {
          hardwareTotal += price; // Add to hardware total
        } else if (category === "Software") {
          softwareTotal += price; // Add to software total
        }
      }
    });

    setTotalHardwarePrice(hardwareTotal); // Update state with total hardware price
    setTotalSoftwarePrice(softwareTotal); // Update state with total software price
  };

  const calculateDepartmentSpending = (data: string[][]) => {
    const spending: Record<
      string,
      { totalSpending: number; itemCount: number }
    > = {};

    data.slice(1).forEach((row) => {
      const department = row[10]; // Assuming the department is in column index 10
      const price = parseFloat(row[4]); // Assuming "Preis" is in column index 4

      if (!isNaN(price)) {
        if (!spending[department]) {
          spending[department] = { totalSpending: 0, itemCount: 0 };
        }

        spending[department].totalSpending += price;
        spending[department].itemCount += 1;
      }
    });

    setDepartmentSpending(spending); // Update state with department spending and item counts
  };

  const calculateMonthlySpending = (data: string[][], year: number) => {
    const monthlySpending = Array(12).fill(0);

    data.slice(1).forEach((row) => {
      const date = row[8]?.trim(); // Assuming "Antragsdatum" is in column index 1
      const price = parseFloat(row[4]?.replace(",", ".").trim()); // Assuming "Preis" is in column index 9

      if (date && !isNaN(price)) {
        const [yearPart, monthPart] = date.split("-"); // Assuming "YYYY-MM-DD" format
        if (parseInt(yearPart, 10) === year) {
          const month = parseInt(monthPart, 10) - 1; // Convert month to 0-based index
          if (month >= 0 && month < 12) {
            monthlySpending[month] += price; // Add price to the corresponding month
          }
        }
      }
    });

    setMonthlySpending(monthlySpending); // Update state with monthly spending
  };

  const departmentNames = Object.keys(departmentSpending); // Get department names from spending keys

  useEffect(() => {
    const baseWidth = 350;
    const additionalWidth = 75;
    const newChartWidth = baseWidth + departmentNames.length * additionalWidth;
    setWidth(newChartWidth); // Update chart width
  }, [departmentSpending]);

  const axisColor = theme === "light" ? "#000000" : "#ffffff";

  const departmentTotals = departmentNames.map(
    (department) => departmentSpending[department].totalSpending
  );

  const departmentItemCount = departmentNames.map(
    (department) => departmentSpending[department].itemCount
  );

  if (error) {
    return (
      <div>
        {t("error.general")}: {error}
      </div>
    );
  }

  return (
    <div className="">
      {/* Year Selection */}
      <div className="flex flex-wrap justify-start gap-5 p-4">
        <div className="p-2">
          <NormalCard title={t("charts.totalHardwareSoftware")}>
            <div className="text-black dark:text-white">
              <BarChart
                borderRadius={10}
                xAxis={[
                  {
                    id: "barCategories",
                    data: [t("categories.hardware"), t("categories.software")],
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
                sx={() => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: axisColor,
                      strokeWidth: 3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: axisColor,
                    },
                  },
                })}
              />

              <p>
                {t("totals.hardwarePrice")}: {totalHardwarePrice.toFixed(2)} €
              </p>
              <p>
                {t("totals.softwarePrice")}: {totalSoftwarePrice.toFixed(2)} €
              </p>
            </div>
          </NormalCard>
        </div>
        <div className="pl-6">
          <div className="pb-1">
            <label className="mr-2 text-black dark:text-white">
              {t("labels.selectYear")}:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="border p-2 rounded"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <NormalCard title={t("charts.monthlySpending")}>
            <div>
              <BarChart
                borderRadius={10}
                xAxis={[
                  {
                    id: "months",
                    data: [
                      t("months.january"),
                      t("months.february"),
                      t("months.march"),
                      t("months.april"),
                      t("months.may"),
                      t("months.june"),
                      t("months.july"),
                      t("months.august"),
                      t("months.september"),
                      t("months.october"),
                      t("months.november"),
                      t("months.december"),
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
                sx={() => ({
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                      stroke: axisColor,
                      strokeWidth: 3,
                    },
                    [`.${axisClasses.tickLabel}`]: {
                      fill: axisColor,
                    },
                  },
                })}
              />
            </div>
          </NormalCard>
        </div>
      </div>
      <div className="w-full p-6">
        <div className="flex flex-wrap items-center ">
          <div className="mr-10 mb-6">
            <NormalCard title={t("charts.departmentTotalSpending")}>
              <div>
                <BarChart
                  borderRadius={10}
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
                  sx={() => ({
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: axisColor,
                        strokeWidth: 3,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: axisColor,
                      },
                    },
                  })}
                />
              </div>
            </NormalCard>
          </div>
          <div className="mr-10 mb-6">
            <NormalCard title={t("charts.departmentHardwareGivenOut")}>
              <div>
                <BarChart
                  borderRadius={10}
                  xAxis={[
                    {
                      id: "departments",
                      data: departmentNames,
                      scaleType: "band",
                    },
                  ]}
                  series={[
                    {
                      id: "itemCount",
                      data: departmentItemCount,
                    },
                  ]}
                  width={width}
                  height={250}
                  sx={() => ({
                    [`.${axisClasses.root}`]: {
                      [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                        stroke: axisColor,
                        strokeWidth: 3,
                      },
                      [`.${axisClasses.tickLabel}`]: {
                        fill: axisColor,
                      },
                    },
                  })}
                />
              </div>
            </NormalCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphBestand;
