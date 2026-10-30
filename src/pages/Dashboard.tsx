import DashboardLayout from "../components/DashboardLayout";
import { payhubNavItems } from "../config/navigation";

export default function Dashboard() {
  return <DashboardLayout menuItems={payhubNavItems}>{null}</DashboardLayout>;
}
