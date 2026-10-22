import { LayoutDashboardIcon, type LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export const fulltimeNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dashboard' }
];

export const internNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/dboard' }
];

export const consultantNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboardIcon, path: '/consultant-dashboard' }
];
