import {
  House,
  Heart,
  History,
  User,
  LogOut,
  Upload,
  LayoutDashboard,
  ListMusic,
  Menu,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { animateNavbar } from "../animations";
const Navbar = () => {
  const navbarRef = useRef(null);
  useGSAP(() => {
    animateNavbar({
      navbarRef,
    });
  }, []);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged Out Successfully!");

    navigate("/");
  };

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 h-20 flex items-center justify-between px-4 md:px-6 lg:px-10 backdrop-blur-xl bg-zinc-950/70 border-b border-white/10 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/40">
          🎵
        </div>

        <div>
          <h1 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Moody Player
          </h1>

          <p className="hidden sm:block text-[11px] uppercase tracking-[0.25em] text-zinc-500">
            AI Music
          </p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-6 text-zinc-300">
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

            <Link
              to="/playlists"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                location.pathname === "/playlists"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "hover:bg-purple-500/15 hover:text-purple-400"
              }`}
            >
              <ListMusic size={18} />
              Playlists
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
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden text-white"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40"
            />

            {/* Drawer */}

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-screen w-[300px] bg-zinc-950 border-l border-zinc-800 z-50 p-6 lg:hidden flex flex-col"
            >
              {/* Header */}

              <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-bold text-purple-400">Menu</h2>

                <button onClick={() => setMenuOpen(false)}>
                  <X size={28} />
                </button>
              </div>

              {/* Links */}

              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/15"
                >
                  <House size={20} />
                  Home
                </Link>

                {user && (
                  <>
                    <Link
                      to="/history"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        location.pathname === "/history"
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "hover:bg-purple-500/15 hover:text-purple-400"
                      }`}
                    >
                      <History size={18} />
                      History
                    </Link>

                    <Link
                      to="/favorites"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                        location.pathname === "/favorites"
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "hover:bg-purple-500/15 hover:text-purple-400"
                      }`}
                    >
                      <Heart size={18} />
                      Favorites
                    </Link>

                    <Link
                      to="/playlists"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        location.pathname === "/playlists"
                          ? "bg-purple-600 text-white"
                          : "hover:bg-purple-500/15"
                      }`}
                    >
                      <ListMusic size={20} />
                      Playlists
                    </Link>

                    {user.role === "admin" && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/15"
                        >
                          <LayoutDashboard size={20} />
                          Dashboard
                        </Link>

                        <Link
                          to="/upload"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/15"
                        >
                          <Upload size={20} />
                          Upload
                        </Link>
                      </>
                    )}

                    <div className="mt-6 border-t border-zinc-800 pt-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold">{user.name}</p>

                          <p className="text-sm text-zinc-400 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </>
                )}

                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/15"
                    >
                      <User size={20} />
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-500/15"
                    >
                      <User size={20} />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
