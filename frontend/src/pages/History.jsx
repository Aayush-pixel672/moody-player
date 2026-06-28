import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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
      <h1 className="text-5xl font-bold text-purple-500 mb-10">
        Listening History ({history.length})
      </h1>

      {history.length > 0 && (
        <div className="mb-8">
          <button
            onClick={clearHistory}
            className="bg-red-800 hover:bg-red-900 px-5 py-3 rounded-xl transition"
          >
            Clear History
          </button>
        </div>
      )}

      {/* NO HISTORY */}

      {history.length === 0 && (
        <h2 className="text-zinc-400 text-xl">No listening history yet</h2>
      )}

      {/* HISTORY LIST */}

      <div className="space-y-5">
        {history.map((item) => (
          <div
            key={item._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-5"
          >
            <img
              src={item.songId?.image}
              alt=""
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-2xl font-semibold">{item.songId?.title}</h2>

                <p className="text-zinc-400">{item.songId?.artist}</p>

                <p className="text-sm text-zinc-500 mt-1">
                  Played on {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => playAgain(item.songId)}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                >
                  Play Again
                </button>

                <button
                  onClick={() => removeHistory(item._id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
