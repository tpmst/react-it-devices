const snmp = require("net-snmp");
const ping = require("ping");
const fs = require("fs");
const { parse } = require("csv-parse");
const path = require('path');

// Define a function to read and parse the CSV file
function readDevicesFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const devices = [];
        fs.createReadStream(filePath)
            .pipe(parse({ columns: true }))
            .on("data", (row) => {
                // Map CSV columns to the device object
                const device = {
                    Name: row.Name,
                    IPAddress: row.IPAddress,
                    ColorPrinter: row.ColorPrinter === "true", // Convert "true"/"false" strings to boolean
                    OIDBlack: row.OIDBlack.split(";").map(oid => oid.trim()), // Split OIDs by semicolon and trim spaces
                    OIDColor: row.OIDColor.split(";").map(oid => oid.trim())  // Split OIDs by semicolon and trim spaces
                };
                devices.push(device);
            })
            .on("end", () => {
                resolve(devices);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

// Function to process each device
function processDevice(device) {
    return new Promise((resolve) => {
        ping.sys.probe(device.IPAddress, (isAlive) => {
            if (!isAlive) {
                resolve({ ...device, PrintsBlackWhite: "-", PrintsColor: "-", Status: "Offline" });
                return;
            }

            const session = snmp.createSession(device.IPAddress, "public");
            let promises = [];

            device.OIDBlack.forEach((oid) => {
                promises.push(
                    new Promise((resolve) => {
                        session.get([oid], (error, varbinds) => {
                            if (error) {
                                console.error(error);
                                resolve(0); // Resolve as 0 on error
                            } else {
                                resolve(varbinds[0].value);
                            }
                        });
                    })
                );
            });

            if (device.ColorPrinter) {
                device.OIDColor.forEach((oid) => {
                    promises.push(
                        new Promise((resolve) => {
                            session.get([oid], (error, varbinds) => {
                                if (error) {
                                    console.error(error);
                                    resolve(0); // Resolve as 0 on error
                                } else {
                                    resolve(varbinds[0].value);
                                }
                            });
                        })
                    );
                });
            }

            Promise.all(promises).then((results) => {
                const totalBlackWhite = results.slice(0, device.OIDBlack.length).reduce((acc, val) => acc + val, 0);
                const totalColor = device.ColorPrinter ? results.slice(device.OIDBlack.length).reduce((acc, val) => acc + val, 0) : "N/A";

                resolve({
                    Name: device.Name,
                    IP: device.IPAddress,
                    PrintsBlackWhite: totalBlackWhite,
                    PrintsColor: totalColor,
                    Status: "Online"
                });

                session.close();
            });
        });
    });
}

// Main function to process all devices
async function processAllDevices(filePath) {
    try {
        const devices = await readDevicesFromCSV(filePath);
        const results = await Promise.all(devices.map(processDevice));
        return results; // Return the array of results
    } catch (error) {
        console.error("Error processing devices:", error);
        throw error; // Rethrow error to handle it in the calling function
    }
}

// Function to handle the request and send the response
async function getPrinterCounts(req, res) {
    try {
        const csvFilePath = path.join(__dirname, '../files/csv', "04_it-printers.csv");
        const results = await processAllDevices(csvFilePath);
        res.json(results); // Send the results as a JSON response
    } catch (error) {
        res.status(500).json({ error: "Error processing printer counts" });
    }
}

module.exports = {
    getPrinterCounts,
};
