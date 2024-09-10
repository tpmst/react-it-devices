import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MouseIcon from "@mui/icons-material/Mouse";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import DrawerCard from "./drawer/drawerCard";
import clsx from "clsx"; // for conditional class joining
import { useTheme } from "../context/themeContext";

interface MenuDrawerProps {
  setSite: (site: string) => void;
}

export default function MenuDrawer({ setSite }: MenuDrawerProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { theme } = useTheme(); // Get the current theme from the ThemeProvider

  const textColor = theme === "light" ? "#444444" : "#ffffff";
  const bg = theme === "light" ? "#eceadb" : "#1e293b";

  const handleMenuClick = (site: string) => {
    setSite(site);
  };

  const toggleDrawerExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  let sxList: string | number = "*"; // Declare it as string or number

  if (!isExpanded) {
    // Attempt to parse sxList to an integer
    sxList = parseInt(sxList as string, 90); // Use radix 10 (decimal), casting sxList as string

    // Check if the result is NaN, meaning the conversion failed
    if (isNaN(sxList)) {
      console.log("sxList cannot be converted to a number.");
      sxList = 90; // Fallback value
    }
  } else {
    sxList = "*"; // Reset to "*"
  }

  return (
    <div className="flex relative">
      {/* Persistent Drawer */}
      <Drawer
        variant="permanent" // Drawer is always visible
        className="transition-all duration-300 ease-in-out"
        sx={{
          width: isExpanded ? 250 : 90, // Adjust width based on expanded state
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isExpanded ? 250 : 90, // Adjust the drawer paper width
            boxSizing: "border-box",
            transition: "width 0.3s", // Smooth width transition
            backgroundColor: bg, // Dark background
            color: textColor, // Text color
            overflowX: "hidden", // Prevent horizontal overflow
          },
        }}
      >
        <Box className="flex flex-col h-full">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4">
            <div className="max-h-[20px]">
              <h1
                className={clsx(
                  "text-black text-2xl dark:text-white",
                  isExpanded ? "block" : "hidden"
                )}
              >
                ITWebapp
              </h1>
            </div>
            {/* Collapse/Expand Button */}
            <IconButton onClick={toggleDrawerExpand}>
              {isExpanded ? (
                <ArrowBackIos
                  sx={{
                    color: textColor,
                  }}
                />
              ) : (
                <ArrowForwardIos
                  sx={{
                    color: textColor,
                  }}
                />
              )}
            </IconButton>
          </div>
          {/* Drawer list items */}
          <div className="flex flex-col h-full">
            <div className="mt-auto">
              <List>
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("dashboard")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <DashboardIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="Dashboard"
                          sx={{
                            color: textColor,
                            height: 16,
                            alignItems: "center",
                            justifyItems: "center",
                            paddingBottom: 3,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                <div className="m-2"></div>
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("einkauf")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <ShoppingCartIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="Einkauf"
                          sx={{
                            color: textColor,
                            height: 16,
                            alignItems: "center",
                            justifyItems: "center",
                            paddingBottom: 3,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                <div className="m-2"></div>
                {/* More List Items */}
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("xlsx")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <TableChartIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="Excel-Sheet"
                          sx={{
                            color: textColor,
                            height: 16,
                            alignItems: "center",
                            justifyItems: "center",
                            paddingBottom: 3,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                <div className="m-2"></div>
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("pdf")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <DescriptionIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="PDF-Files"
                          sx={{
                            color: textColor,
                            height: 16,
                            alignItems: "center",
                            justifyItems: "center",
                            paddingBottom: 3,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                <div className="m-2"></div>
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("tabelle")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <MouseIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="Tabelle"
                          sx={{ color: textColor }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                <div className="m-2"></div>
                <DrawerCard>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick("drucker")}
                      sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                    >
                      <ListItemIcon>
                        <PrintIcon
                          sx={{
                            color: textColor,
                          }}
                        />
                      </ListItemIcon>
                      {isExpanded && (
                        <ListItemText
                          primary="Drucker"
                          sx={{ color: textColor }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </DrawerCard>
                {/* Settings Item at the Bottom */}
              </List>
            </div>
            <div className="mt-auto"></div>
          </div>

          <div className="mr-3 ml-3">
            <Divider className="bg-gray-300"></Divider>
          </div>

          <div className="mt-auto mb-4">
            <List>
              <DrawerCard>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleMenuClick("settings")}
                    sx={{ height: 40, padding: 1, paddingLeft: 2 }}
                  >
                    <ListItemIcon>
                      <SettingsIcon
                        sx={{
                          color: textColor,
                        }}
                      />
                    </ListItemIcon>
                    {isExpanded && (
                      <ListItemText
                        primary="Einstellungen"
                        sx={{
                          color: textColor,
                          height: 16,
                          alignItems: "center",
                          justifyItems: "center",
                          paddingBottom: 3,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </DrawerCard>
            </List>
          </div>
        </Box>
      </Drawer>

      {/* Main content goes here */}
    </div>
  );
}
