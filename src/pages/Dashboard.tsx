import DashboardLayout from '../components/DashboardLayout';
import { consultantNavItems, fulltimeNavItems, internNavItems } from '../config/navigation';
import { useAppSelector } from '../store';

export default function Dashboard() {
  const userType = useAppSelector((state) => state.auth.user?.userType);
  const menuItems =
    userType === 'interns' ? internNavItems : userType === 'consultant' ? consultantNavItems : fulltimeNavItems;

  return <DashboardLayout menuItems={menuItems}>{null}</DashboardLayout>;
}
