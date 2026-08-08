import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Package,
  User,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/user/dashboard",
  },
  {
    label: "Place Order",
    icon: PlusCircle,
    path: "/user/placeorder",
  },
  {
    label: "Orders History",
    icon: Package,
    path: "/user/orders-history",
  },
  {
    label: "About Us",
    icon: User,
    path: "/user/about-us",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">      
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-[#1B1B2F]">
          Cargo<span className="text-[#E8734A]">Connect</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1 flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            {...item}
            active={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 pt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ label, icon: Icon, path, active }) {
  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
        active
          ? "bg-[#FDEDE7] text-[#E8734A]"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}