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
    <div className="min-h-screen bg-black text-white p-10">
      <div className="mb-12">
        <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
          Your Music Journey
        </p>

        <h1 className="text-5xl font-extrabold">Recently Played</h1>

        <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
          Browse every song you've listened to and jump back into your favorite
          tracks anytime.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-purple-600/15 border border-purple-500/20 px-5 py-3 rounded-full">
          <span className="text-2xl">🎵</span>

          <span className="font-semibold">{history.length} Songs Played</span>
        </div>
      </div>

      {history.length > 0 && (
        <div className="mb-8">
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            🗑️ Clear History
          </button>
        </div>
      )}

      {/* NO HISTORY */}

      {history.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-8xl mb-6">🎧</div>

          <h2 className="text-4xl font-bold mb-4">No Listening History Yet</h2>

          <p className="text-zinc-400 text-center max-w-lg leading-8">
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
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-purple-500/40 rounded-3xl p-5 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
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
              className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-lg"
            />

            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {item.songId?.title}
                </h2>

                <p className="text-zinc-400 mt-1">{item.songId?.artist}</p>

                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-medium">
                    {item.songId?.mood}
                  </span>

                  <span className="text-xs text-zinc-500">
                    🕒 {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => playAgain(item.songId)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/30"
                >
                  ▶ Play Again
                </button>

                <button
                  onClick={() => removeHistory(item._id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
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
