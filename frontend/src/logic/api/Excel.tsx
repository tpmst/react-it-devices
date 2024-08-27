import axios from "axios";

/**
 * Adds a new line to the Excel file on the server.
 * @param authToken - The JWT token for authentication.
 * @param newRow - An array representing the new row data.
 * @returns A promise that resolves to the server response.
 */
export const addLineToExcel = async (
  authToken: string,
  newRow: string[]
): Promise<string> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/add-line",
      { newRow },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.message;
  } catch (error: any) {
    // Casting error to 'any' to access its properties
    throw new Error(
      `Error adding row: ${error.response?.data?.message || error.message}`
    );
  }
};
