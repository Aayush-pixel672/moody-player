import { House, Heart, History } from "lucide-react";

import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full h-16 flex items-center justify-between px-10 border-b border-zinc-800">
      <h1 className="text-2xl font-bold text-purple-500">Moody Player</h1>

      <div className="flex gap-8 text-zinc-300">
        <Link
          to="/"
          className="flex items-center gap-2 hover:text-purple-400 transition"
        >
          <House size={18} />
          Home
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-2 hover:text-purple-400 transition"
        >
          <History size={18} className="inline mb-1" />
          History
        </Link>

        

        <Link
          to="/favorites"
          className="flex items-center gap-2 hover:text-purple-400 transition"
        >
          <Heart size={18} className="inline mb-1" />
          Favorites
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
