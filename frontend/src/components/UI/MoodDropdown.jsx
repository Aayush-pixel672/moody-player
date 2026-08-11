import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const moods = [
  { label: "All", emoji: "🎵" },
  { label: "Happy", emoji: "😊" },
  { label: "Sad", emoji: "😢" },
  { label: "Angry", emoji: "😡" },
  { label: "Neutral", emoji: "😐" },
  { label: "Surprised", emoji: "😲" },
];

const MoodDropdown = ({ value, onChange, includeAll = true }) => {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const availableMoods = includeAll
    ? moods
    : moods.filter((mood) => mood.label !== "All");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedMood =
    moods.find((mood) => mood.label === value) || moods[0];

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Main Dropdown Button */}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-zinc-900/70 border border-zinc-700 hover:border-purple-500 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {selectedMood.emoji}
          </span>

          <span>{selectedMood.label}</span>
        </div>

        <motion.div
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* Dropdown Options */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
            }}
            className="absolute left-0 mt-3 w-full rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden z-50"
          >
            {availableMoods.map((mood) => (
              <button
                type="button"
                key={mood.label}
                onClick={() => {
                  onChange(mood.label);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-5 py-3 transition-all hover:bg-purple-600/20 ${
                  value === mood.label
                    ? "bg-purple-600/20 text-purple-400"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{mood.emoji}</span>

                  <span>{mood.label}</span>
                </div>

                {value === mood.label && (
                  <Check size={18} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodDropdown;