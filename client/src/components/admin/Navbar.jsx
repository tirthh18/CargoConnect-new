import { Link, useLocation, useNavigate } from "react-router-dom";
import { Package2, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const menus = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      label: "Routes",
      path: "/admin/routes",
    },

  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b">

      <div className="px-8 h-20 flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-14">

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <Package2
              size={28}
              className="text-[#1B1B2F]"
            />

            <span className="text-3xl font-bold text-[#1B1B2F]">
              CargoConnect
            </span>

          </Link>

          {/* Navigation */}

          <nav className="flex gap-10">

            {menus.map((menu) => (

              <Link
                key={menu.path}
                to={menu.path}
                className={`font-medium transition-colors ${
                  location.pathname === menu.path
                    ? "text-[#E8734A]"
                    : "text-slate-600 hover:text-[#E8734A]"
                }`}
              >
                {menu.label}
              </Link>

            ))}

          </nav>

        </div>

        {/* Right */}

        <div className="flex items-center gap-6">

          <p className="text-slate-700 font-medium">

            Welcome,&nbsp;

            <span className="font-semibold">

              {user?.email}

            </span>

          </p>

          <button
            onClick={handleLogout}
            className="w-11 h-11 rounded-xl border hover:bg-red-50 hover:border-red-200 flex items-center justify-center transition-colors"
          >
            <LogOut
              size={20}
              className="text-slate-600"
            />
          </button>

        </div>

      </div>

    </header>
  );
}