import {
  House,
  Heart,
  History,
  User,
  LogOut,
  Upload,
  LayoutDashboard,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully!");

    navigate("/");

  };

  return (

    <nav className="w-full h-16 flex items-center justify-between px-10 border-b border-zinc-800">

      <h1 className="text-2xl font-bold text-purple-500">
        Moody Player
      </h1>

      <div className="flex items-center gap-8 text-zinc-300">

        {/* Home */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-purple-400 transition"
        >
          <House size={18} />
          Home
        </Link>

        {/* Logged In */}
        {user && (
          <>

            <Link
              to="/history"
              className="flex items-center gap-2 hover:text-purple-400 transition"
            >
              <History size={18} />
              History
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-2 hover:text-purple-400 transition"
            >
              <Heart size={18} />
              Favorites
            </Link>

            {/* Admin Dashboard */}
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 hover:text-purple-400 transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            )}

            {/* Upload */}
            {user.role === "admin" && (
              <Link
                to="/upload"
                className="flex items-center gap-2 hover:text-purple-400 transition"
              >
                <Upload size={18} />
                Upload
              </Link>
            )}

            <span className="text-purple-400 font-semibold">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
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
              className="flex items-center gap-2 hover:text-purple-400 transition"
            >
              <User size={18} />
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 hover:text-purple-400 transition"
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