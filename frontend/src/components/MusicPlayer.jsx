import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const MusicPlayer = ({ currentSong, setCurrentSong, songsData }) => {
  const audioRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playNextSong = () => {
    if (!currentSong) return;

    const currentIndex = songsData.findIndex(
      (song) => song._id === currentSong._id,
    );

    const nextSong = songsData[(currentIndex + 1) % songsData.length];

    setCurrentSong(nextSong);
  };

  const playPreviousSong = () => {
    if (!currentSong) return;

    const currentIndex = songsData.findIndex(
      (song) => song._id === currentSong._id,
    );

    const previousSong =
      songsData[(currentIndex - 1 + songsData.length) % songsData.length];

    setCurrentSong(previousSong);
  };

  // AUTO PLAY

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Play Error:", error);
      }
    };

    playAudio();
  }, [currentSong]);

  // SAVE HISTORY

  useEffect(() => {
    if (!currentSong) return;

    const addToHistory = async () => {
      try {
        await api.post("/history", {
          songId: currentSong._id,
        });

        console.log("History saved");
      } catch (error) {
        console.error("History Error:", error);
      }
    };

    addToHistory();
  }, [currentSong]);

  // TRACK PROGRESS

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentSong]);

  // PLAY / PAUSE

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // FORMAT TIME

  const formatTime = (time) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-t border-white/10 px-8 py-4 flex items-center justify-between shadow-2xl">
      {/* LEFT */}

      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={
              currentSong?.image ||
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
            }
            alt={currentSong?.title || "Album Art"}
            className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-lg"
          />

          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-pulse border-2 border-zinc-950" />
          )}
        </div>

        <div className="max-w-[220px]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-purple-400 font-semibold mb-1">
            Now Playing
          </p>
          <h2 className="text-lg font-bold text-white truncate">
            {currentSong?.title || "No Song Selected"}
          </h2>

          <p className="text-sm text-zinc-400 truncate mt-1">
            {currentSong?.artist || "Unknown Artist"}
          </p>

          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-medium">
            {currentSong?.mood || "No Mood"}
          </span>
        </div>
      </div>

      {/* CENTER */}

      <div className="flex flex-col items-center w-[40%]">
        <div className="flex items-center gap-6">
          <button
            onClick={playPreviousSong}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-purple-600/20 hover:scale-110 transition-all duration-300"
          >
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/50"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={playNextSong}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-purple-600/20 hover:scale-110 transition-all duration-300"
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* PROGRESS BAR */}

        <div className="flex items-center gap-3 w-full mt-5">
          <span className="text-xs text-zinc-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <div className="flex-1 h-2.5 bg-zinc-800/80 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-200 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
              style={{
                width: `${(currentTime / duration) * 100 || 0}%`,
              }}
            />
          </div>

          <span className="text-xs text-zinc-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* AUDIO */}

      <audio ref={audioRef} src={currentSong?.audio} />
    </div>
  );
};

export default MusicPlayer;
