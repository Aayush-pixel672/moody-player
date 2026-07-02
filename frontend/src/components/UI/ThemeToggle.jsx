import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {

  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.15 }}
      onClick={toggleTheme}
      className="
        w-12
        h-12
        rounded-full
        bg-zinc-900
        border
        border-zinc-700
        flex
        items-center
        justify-center
        text-white
        hover:border-purple-500
        hover:shadow-lg
        hover:shadow-purple-500/30
        transition-all
      "
    >
      {theme === "dark" ? (
        <Sun size={22} />
      ) : (
        <Moon size={22} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;