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
                const device = {
                    Name: row.Name,
                    IPAddress: row.IPAddress,
                    ColorPrinter: row.ColorPrinter === "true",
                    OIDToner: row.OIDToner ? row.OIDToner.split(";").map(oid => oid.trim()) : []
                };
                devices.push(device);
            })
            .on("end", () => resolve(devices))
            .on("error", (error) => reject(error));
    });
}

// Function to process each device
function processDevice(device) {
    return new Promise((resolve) => {
        ping.sys.probe(device.IPAddress, (isAlive) => {
            if (!isAlive) {
                resolve({ ...device, TonerLevels: "-", Status: "Offline" });
                return;
            }

            const session = snmp.createSession(device.IPAddress, "public");
            let promises = [];

            device.OIDToner.forEach((oid) => {
                if (/^\d+(\.\d+)*$/.test(oid)) {  // Ensure it's a valid OID format
                    promises.push(
                        new Promise((resolve) => {
                            session.get([oid], (error, varbinds) => {
                                if (error) {
                                    console.error(`SNMP Error for OID ${oid} on ${device.Name}:`, error);
                                    resolve(0);  // Resolve to 0 on error
                                } else {
                                    resolve(varbinds[0].value);
                                }
                            });
                        })
                    );
                } else {
                    console.error(`Invalid OID format: ${oid} for device ${device.Name}`);
                    promises.push(Promise.resolve(0));  // Resolve to 0 if OID is invalid
                }
            });

            Promise.all(promises).then((results) => {
                const tonerLevels = device.ColorPrinter ? {
                    Black: results[0],
                    Cyan: results[1],
                    Magenta: results[2],
                    Yellow: results[3]
                } : {
                    Black: results[0],
                    Cyan: "N/A",
                    Magenta: "N/A",
                    Yellow: "N/A"
                };

                resolve({
                    Name: device.Name,
                    IP: device.IPAddress,
                    ColorPrinter: device.ColorPrinter,
                    TonerLevels: tonerLevels,
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
        return results;
    } catch (error) {
        console.error("Error processing devices:", error);
        throw error;
    }
}

// Function to handle the request and send the response
async function getPrinterToner(req, res) {
    try {
        const csvFilePath = path.join(__dirname, '../files/csv', "05_it-printerstoner.csv");
        const results = await processAllDevices(csvFilePath);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Error processing printer toner levels" });
    }
}

module.exports = {
    getPrinterToner,
};
