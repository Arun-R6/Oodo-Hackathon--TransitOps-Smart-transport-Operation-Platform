import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Truck, Users, MapPin, Wrench,
  DollarSign, BarChart2, LogOut, Bus
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vehicles", icon: Truck, label: "Vehicles" },
  { to: "/drivers", icon: Users, label: "Drivers" },
  { to: "/trips", icon: MapPin, label: "Trips" },
  { to: "/maintenance", icon: Wrench, label: "Maintenance" },
  { to: "/expenses", icon: DollarSign, label: "Fuel & Expenses" },
  { to: "/reports", icon: BarChart2, label: "Reports" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bus className="text-blue-600" size={28} />
          <span className="text-xl font-bold text-blue-600">TransitOps</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.role?.replace("_", " ")}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{user?.name}</div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
