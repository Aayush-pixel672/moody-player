import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const History = ({ setCurrentSong }) => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history");

        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const removeHistory = async (historyId) => {
    try {
      await api.delete(`/history/${historyId}`);

      setHistory(history.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Error removing history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await api.delete("/history");
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const playAgain = (song) => {
    setCurrentSong(song);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 md:p-10">
      <div className="mb-12">
        <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
          Your Music Journey
        </p>

        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Recently Played
          
        </h1>

        <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Browse every song you've listened to and jump back into your favorite
          tracks anytime.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-purple-500/20 bg-purple-600/15 px-4 py-2 sm:px-5 sm:py-3">
          <span className="text-2xl">🎵</span>

          <span className="font-semibold">{history.length} Songs Played</span>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mb-8">
          <button
            onClick={clearHistory}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white sm:w-fit"
          >
            🗑️ Clear History
          </button>
        </div>
      )}

      {/* NO HISTORY */}

      {history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-8xl mb-6">🎧</div>

          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">No Listening History Yet</h2>

          <p className="max-w-lg text-center text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start playing your favorite songs and we'll keep track of your
            listening history here.
          </p>

          <div className="mt-8 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">
            Your recently played songs will appear here.
          </div>
        </div>
      )}

      {/* HISTORY LIST */}

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {history.map((item, index) => (
          <motion.div
            key={item._id}
            className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.15,
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            <img
              src={item.songId?.image}
              alt=""
              className="h-20 w-20 self-center rounded-2xl border border-white/10 object-cover shadow-lg sm:h-24 sm:w-24 sm:self-auto"
            />

            <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-white sm:text-xl lg:text-2xl">
                  {item.songId?.title}
                </h2>

                <p className="mt-1 truncate text-sm text-zinc-400 sm:text-base">{item.songId?.artist}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-medium">
                    {item.songId?.mood}
                  </span>

                  <span className="text-xs text-zinc-500">
                    🕒 {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <button
                  onClick={() => playAgain(item.songId)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 sm:w-auto"
                >
                  ▶ Play Again
                </button>

                <button
                  onClick={() => removeHistory(item._id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white sm:w-auto"
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default History;
