import type { ComponentType, SVGProps } from "react";
import overviewIcon from "../assets/icons/dashboard.svg?react";
import collectionsIcon from "../assets/icons/collections.svg?react";
import payoutsIcon from "../assets/icons/payouts.svg?react";
import vAccountsIcon from "../assets/icons/wallet.svg?react";
import reconcilationIcon from "../assets/icons/reconcilation.svg?react";
import reportsIcon from "../assets/icons/reports.svg?react";
import adminIcon from "../assets/icons/admin.svg?react";

export interface NavItem {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path: string;
  section: string;
}

export const payhubNavItems: NavItem[] = [
  {
    section: "MONITOR",
    label: "Overview",
    icon: overviewIcon,
    path: "/dashboard",
  },
  {
    section: "MONITOR",
    label: "Collections",
    icon: collectionsIcon,
    path: "/collections",
  },
  { section: "MONITOR", label: "Payouts", icon: payoutsIcon, path: "/payouts" },
  {
    section: "MONITOR",
    label: "Virtual Accounts",
    icon: vAccountsIcon,
    path: "/virtualaccounts",
  },
  {
    section: "FINANCE",
    label: "Reconciliation",
    icon: reconcilationIcon,
    path: "/reconciliation",
  },
  { section: "FINANCE", label: "Reports", icon: reportsIcon, path: "/reports" },
  {
    section: "CONFIGURE",
    label: "Administration",
    icon: adminIcon,
    path: "/administration",
  },
];

// export const internNavItems: NavItem[] = [
//   { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dboard' }
// ];

// export const consultantNavItems: NavItem[] = [
//   { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/consultant-dashboard' }
// ];
