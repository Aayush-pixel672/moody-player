import {
  House,
  Heart,
  History,
  User,
  LogOut,
  Upload,
  LayoutDashboard,
} from "lucide-react";

import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully!");

    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 h-20 flex items-center justify-between px-10 backdrop-blur-xl bg-zinc-950/70 border-b border-white/10 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/40">
          🎵
        </div>

        <div>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Moody Player
          </h1>

          <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">
            AI Music
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 text-zinc-300">
        {/* Home */}
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            location.pathname === "/"
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
              : "hover:bg-purple-500/15 hover:text-purple-400"
          }`}
        >
          <House size={18} />
          Home
        </Link>

        {/* Logged In */}
        {user && (
          <>
            <Link
              to="/history"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
            >
              <History size={18} />
              History
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
            >
              <Heart size={18} />
              Favorites
            </Link>

            {/* Admin Dashboard */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}

            {/* Upload */}
            {user.role === "admin" && (
              <Link
                to="/upload"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
              >
                <Upload size={18} />
                Upload
              </Link>
            )}

            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">{user.name}</p>

                <p className="text-xs text-zinc-400 capitalize">{user.role}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}

        {/* Logged Out */}
        {!user && (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
            >
              <User size={18} />
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-purple-500/15 hover:text-purple-400 transition-all duration-300"
            >
              <User size={18} />
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
