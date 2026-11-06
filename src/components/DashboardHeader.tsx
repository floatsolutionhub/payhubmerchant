import { Box, IconButton, Typography } from "@mui/material";
import ToggleSidebarIcon from "../assets/icons/left-panel-close.svg?react";
import NotificationIcon from "../assets/icons/bell-notification.svg?react";

interface DashboardHeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
  onNotificationsClick?: () => void;
}

export default function DashboardHeader({
  title = "FSDH Payhub",
  onToggleSidebar,
  onNotificationsClick,
}: DashboardHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        height: 80,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        px: 3,
        borderBottom: "1px solid #EAECF0",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <IconButton
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
        sx={{ color: "#004987", p: 0.5 }}
      >
        <ToggleSidebarIcon width={32} height={32} />
      </IconButton>

      <Box sx={{ width: "1px", height: 36, bgcolor: "#D0D5DD", mx: 2.5 }} />

      <Typography
        component="h1"
        sx={{ flex: 1, fontWeight: 700, fontSize: 20, color: "#101828" }}
      >
        {title}
      </Typography>

      <IconButton
        onClick={onNotificationsClick}
        aria-label="Notifications"
        sx={{
          width: 48,
          height: 48,
          bgcolor: "#F3F3F3",
          color: "#1E1E1E",
          mr: 3,
          "&:hover": { bgcolor: "#E9EAEB" },
        }}
      >
        <NotificationIcon width={22} height={22} />
      </IconButton>
    </Box>
  );
}
