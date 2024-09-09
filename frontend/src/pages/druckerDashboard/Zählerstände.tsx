import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../security/config";

// Dashboard component for displaying printer data in a table
const Zaelerstaende = () => {
  const [data, setData] = useState<any[]>([]); // Store parsed JSON data
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        const response = await axios.get(`${API_BASE_URL}/printercounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-auto p-4">
      <table className="min-w-full bg-white border border-gray-300 dark:bg-[#1e293b]">
        <thead>
          <tr>
            <th className="px-4 py-2 border bg-gray-300 text-black dark:text-gray-100 dark:bg-gray-700">
              Name
            </th>
            <th className="px-4 py-2 border bg-gray-300 text-black dark:text-gray-100 dark:bg-gray-700">
              IP Address
            </th>
            <th className="px-4 py-2 border bg-gray-300 text-black dark:text-gray-100 dark:bg-gray-700">
              Prints Black & White
            </th>
            <th className="px-4 py-2 border bg-gray-300 text-black dark:text-gray-100 dark:bg-gray-700">
              Prints Color
            </th>
            <th className="px-4 py-2 border bg-gray-300 text-black dark:text-gray-100 dark:bg-gray-700">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((device, index) => (
            <tr key={index}>
              <td className="px-4 text-black dark:text-gray-100 py-2 border">
                {device.Name}
              </td>
              <td className="px-4 text-black dark:text-gray-100 py-2 border">
                {device.IP}
              </td>
              <td className="px-4 text-black dark:text-gray-100 py-2 border">
                {device.PrintsBlackWhite}
              </td>
              <td className="px-4 text-black dark:text-gray-100 py-2 border">
                {device.PrintsColor}
              </td>
              <td
                className={`px-4 py-2 border ${
                  device.Status === "Online" ? "text-green-600" : "text-red-600"
                }`}
              >
                {device.Status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Zaelerstaende;
