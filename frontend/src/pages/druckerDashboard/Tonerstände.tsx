import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../security/config";
import { axisClasses, BarChart } from "@mui/x-charts";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import { Typography } from "@mui/material";
import { useTheme } from "../../context/themeContext";

const Tonerlevels = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setLoading(true);

    if (token) {
      setAuthToken(token);
    } else {
      setError("No token found, please log in.");
      return;
    }

    const fetchPrinterCounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/printertoner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setSelectedPrinter(response.data[0]); // Set the first printer as the default
      } catch (error: any) {
        setError(
          `Error fetching printer counts: ${
            error.response?.data?.message || error.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrinterCounts();
  }, [authToken]);

  const axisColor = theme === "light" ? "#000000" : "#ffffff";

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handlePrinterChange = (event: SelectChangeEvent<string>) => {
    const selectedName = event.target.value;
    const printer = data.find((device) => device.Name === selectedName);

    if (printer) {
      // If the printer is black-and-white or its name is "BIZHUB C3110 COLOR", adjust toner levels
      if (
        (!printer.ColorPrinter && printer.Name !== "BIZHUB 223") ||
        printer.Name === "BIZHUB C3110 COLOR"
      ) {
        printer.TonerLevels = {
          Black: isNaN(printer.TonerLevels?.Black)
            ? 0
            : 100 - (printer.TonerLevels?.Black || 0),
          Cyan: printer.TonerLevels?.Cyan
            ? 100 - printer.TonerLevels?.Cyan
            : undefined,
          Magenta: printer.TonerLevels?.Magenta
            ? 100 - printer.TonerLevels?.Magenta
            : undefined,
          Yellow: printer.TonerLevels?.Yellow
            ? 100 - printer.TonerLevels?.Yellow
            : undefined,
        };
      }
      setSelectedPrinter(printer);
    }
  };

  const tonerData = [
    {
      label: "Black",
      value: selectedPrinter?.TonerLevels?.Black,
      color: "#0f0f0f",
    },
    {
      label: "Cyan",
      value: selectedPrinter?.TonerLevels?.Cyan,
      color: "#00FFFF",
    },
    {
      label: "Magenta",
      value: selectedPrinter?.TonerLevels?.Magenta,
      color: "#FF00FF",
    },
    {
      label: "Yellow",
      value: selectedPrinter?.TonerLevels?.Yellow,
      color: "#FFFF00",
    },
  ].filter(
    (item) =>
      item.value !== "N/A" &&
      item.value !== undefined &&
      !isNaN(item.value) &&
      item.value !== null
  );

  return (
    <div className="overflow-auto p-4">
      <FormControl variant="outlined" className="mb-4">
        <InputLabel
          id="printerSelectLabel"
          sx={{ color: axisColor }} // Tailwind's gray-200 color code
        >
          Select Printer
        </InputLabel>
        <Select
          labelId="printerSelectLabel"
          id="printerSelect"
          value={selectedPrinter?.Name || ""}
          onChange={handlePrinterChange}
          label="Select Printer"
          sx={{ color: axisColor }} // Apply gray-200
        >
          {data.map((device, index) => (
            <MenuItem key={index} value={device.Name}>
              {device.Name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="mb-4">
        {selectedPrinter?.Status === "Online" ? (
          <BarChart
            borderRadius={10}
            xAxis={[
              {
                id: "toner",
                data: ["Toner"],
                scaleType: "band",
              },
            ]}
            yAxis={[{ min: 0, max: 100 }]}
            series={tonerData.map((item) => ({
              id: `${item.label.toLowerCase()}Toner`,
              data: [item.value],
              color: item.color,
              barSize: 30, // Set a maximum bar width
            }))}
            width={500}
            height={300}
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
        ) : (
          <div className="flex flex-col items-center">
            <OfflineBoltIcon style={{ fontSize: 100, color: "red" }} />
            <Typography variant="h6" color="error">
              The selected printer is offline
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tonerlevels;
