import { Outlet } from "react-router-dom";
import Sidebar from "@/components/site/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="min-h-screen flex-1">
        <Outlet />
      </div>
    </div>
  );
}
