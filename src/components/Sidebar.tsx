import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import { LogOutIcon } from "lucide-react";
import { NavItem } from "../config/navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store";
import { logout } from "../store/authSlice";
import { clearOnboardingPrefill } from "../store/onboardingSlice";
import { clearApiAccessToken } from "../services/api";
import {
  SESSION_EMPLOYEE_ID_KEY,
  SESSION_ONBOARDING_PREFILL_KEY,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY,
} from "../config/sessionKeys";

interface SidebarProps {
  menuItems: NavItem[];
}
export default function Sidebar({ menuItems }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user?.name || "FSDH Employee";
  const displayEmail = user?.email || "Not signed in";
  const displayInitials =
    user?.initials ||
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") ||
    "EM";

  const sections = Array.from(new Set(menuItems.map((item) => item.section)));

  const handleLogout = () => {
    window.localStorage.removeItem(SESSION_USER_KEY);
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    window.localStorage.removeItem(SESSION_EMPLOYEE_ID_KEY);
    window.localStorage.removeItem(SESSION_ONBOARDING_PREFILL_KEY);
    clearApiAccessToken();
    dispatch(clearOnboardingPrefill());
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        width: 300,
        height: "100vh",
        background: "linear-gradient(180deg, #002443 0%, #005BA9 100%)",
        boxShadow: "0px 8px 28px 0px rgba(1, 5, 17, 0.3)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          p: 5,
          // borderBottom: '1px solid #EFEFEF'
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Merriweather, serif",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: "0.5px",
          }}
        >
          FSDH Payhub
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Avenir, serif",
            fontWeight: 500,
            fontSize: 19,
            letterSpacing: "0.5px",
          }}
        >
          360 Pay & More
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: 2, py: 3, overflowY: "auto" }}>
        {sections.map((section) => (
          <Box key={section} sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: 11,
                letterSpacing: "0.5px",
                color: "#BABABA",
                px: 2,
                mb: 1,
              }}
            >
              {section}
            </Typography>

            <List disablePadding>
              {menuItems
                .filter((item) => item.section === section)
                .map((item) => {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");
                  const Icon = item.icon;
                  return (
                    <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        sx={{
                          bgcolor: isActive ? "#003C70" : "transparent",
                          color: isActive ? "#fff" : "#fff",
                          borderLeft: isActive
                            ? "4px solid #73BEFF"
                            : "4px solid transparent",
                          "&:hover": {
                            bgcolor: isActive
                              ? "#003C70"
                              : "rgba(255, 255, 255, 0.08)",
                          },
                          py: 1.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isActive ? "#ffff" : "#ffff",
                            "& svg [fill]:not([fill='none'])": {
                              fill: "currentColor",
                            },
                            "& svg [stroke]:not([stroke='none'])": {
                              stroke: "currentColor",
                            },
                          }}
                        >
                          <Icon width={24} height={24} />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "16px",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
            </List>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#004987",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {displayInitials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {displayName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: "12px",
            }}
          >
            {displayEmail}
          </Typography>
        </Box>
        <Box
          onClick={handleLogout}
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "#004987",
            },
          }}
        >
          <LogOutIcon size={20} />
        </Box>
      </Box>
    </Box>
  );
}
