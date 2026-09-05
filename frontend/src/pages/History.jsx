import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useMusic } from "../context/MusicContext";
import { Search, Play, Shuffle, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import { useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const History = () => {
  const { setCurrentSong, setIsPlaying } = useMusic();
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const container = useRef(null);
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

  const filteredHistory = useMemo(() => {
    return history.filter((item) =>
      item.songId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [history, searchTerm]);

  useGSAP(
    () => {
      if (!filteredHistory.length) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.from(".hero", {
        opacity: 0,
        y: 50,
        duration: 0.8,
      })

        .from(
          ".history-card",
          {
            opacity: 0,
            y: 35,
            stagger: 0.08,
            duration: 0.45,
            clearProps: "opacity,transform",
          },
          "-=0.2",
        );
    },
    {
      scope: container,
      dependencies: [filteredHistory],
    },
  );

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
    setIsPlaying(true);
    navigate("/");
  };

  const playAll = () => {
    if (!filteredHistory.length) return;

    playAgain(filteredHistory[0].songId);
  };

  const shufflePlay = () => {
    if (!filteredHistory.length) return;

    const randomIndex = Math.floor(Math.random() * filteredHistory.length);

    const randomSong = filteredHistory[randomIndex];

    playAgain(randomSong.songId);
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-black px-4 py-6 pb-40 text-white sm:px-6 md:p-10 md:pb-40"
    >
      <div className="hero relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.45)] mb-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="hero-icon h-36 w-36 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🕒</span>
          </div>

          <div className="hero-content flex-1 text-center md:text-left">
            <p className="uppercase tracking-[4px] text-sm text-zinc-400">
              Your Music Journey
            </p>

            <h1 className="mt-2 text-4xl md:text-5xl font-bold">
              Recently Played
            </h1>

            <p className="mt-4 max-w-xl text-zinc-400">
              Browse every track you've listened to and instantly jump back into
              your favorite moments.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
              <div>
                <p className="text-3xl font-bold">{history.length}</p>
                <p className="text-sm text-zinc-500">Played Songs</p>
              </div>

              <div>
                <p className="text-3xl font-bold">🕒</p>
                <p className="text-sm text-zinc-500">Listening History</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-section mb-10 flex flex-col lg:flex-row gap-4">
        {/* Search */}

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search history..."
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 outline-none transition focus:border-purple-500"
          />
        </div>

        {/* Actions */}

        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={playAll}
          >
            <Play size={18} />
            Play All
          </Button>

          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={shufflePlay}
          >
            <Shuffle size={18} />
            Shuffle
          </Button>

          {history.length > 0 && (
            <Button
              onClick={clearHistory}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={18} />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* NO HISTORY */}

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-8xl mb-6">🎧</div>

          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
            No Listening History Yet
          </h2>

          <p className="max-w-lg text-center text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start playing your favorite songs and we'll keep track of your
            listening history here.
          </p>

          <div className="mt-8 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium">
            Your recently played songs will appear here.
          </div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Search className="mb-6 h-16 w-16 text-zinc-500" />

          <h2 className="mb-4 text-2xl font-bold">No Matching Songs</h2>

          <p className="text-zinc-400">
            Try searching with a different song title.
          </p>
        </div>
      ) : (
        <div className="history-container space-y-5">
          {filteredHistory.map((item) => (
            <div
              key={item._id}
              className="history-card flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(168,85,247,0.12)] sm:flex-row sm:items-center sm:p-5"
            >
              <img
                src={item.songId?.image}
                alt={item.songId?.title}
                className="h-20 w-20 self-center rounded-2xl border border-white/10 object-cover shadow-lg sm:h-24 sm:w-24 sm:self-auto"
              />

              <div className="flex w-full min-w-0 flex-col gap-4 sm:grid sm:grid-cols-3 sm:items-center">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white sm:text-xl lg:text-2xl">
                    {item.songId?.title}
                  </h2>

                  <p className="mt-1 truncate text-sm text-zinc-400 sm:text-base">
                    {item.songId?.artist}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-purple-500/15 px-3 py-1 text-xs font-medium text-purple-400">
                      {item.songId?.mood}
                    </span>

                    <span className="text-xs text-zinc-500">
                      🕒 {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <button
                    onClick={() => playAgain(item.songId)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 sm:w-auto"
                  >
                    <Play size={16} fill="currentColor" />
                    <span>Play Again</span>
                  </button>

                  <button
                    onClick={() => removeHistory(item._id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white sm:w-auto"
                  >
                    <Trash2 size={16} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
