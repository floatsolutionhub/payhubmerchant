import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import type { NavItem } from "../config/navigation";

interface DashboardLayoutProps {
  menuItems: NavItem[];
}

export default function DashboardLayout({ menuItems }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F3F9FF" }}>
      <Sidebar menuItems={menuItems} />
      <Box sx={{ flex: 1, ml: "300px", minWidth: 0 }}>
        <DashboardHeader />
        <Box component="main" sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
