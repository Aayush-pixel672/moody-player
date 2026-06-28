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
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 px-10 py-4 flex items-center justify-between">
      {/* LEFT */}

      <div className="flex items-center gap-4">
        <img
          src={
            currentSong?.image ||
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
          }
          alt=""
          className="w-16 h-16 rounded-xl object-cover"
        />

        <div>
          <h2 className="font-semibold">
            {currentSong?.title || "No song selected"}
          </h2>

          <p className="text-zinc-400 text-sm">
            {currentSong?.artist || "Unknown artist"}
          </p>
        </div>
      </div>

      {/* CENTER */}

      <div className="flex flex-col items-center w-[40%]">
        <div className="flex gap-6 text-2xl">
          <button
            className="hover:text-purple-400 transition"
            onClick={playPreviousSong}
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            className="hover:text-purple-400 transition"
            onClick={playNextSong}
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* PROGRESS BAR */}

        <div className="w-full h-2 bg-zinc-700 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full"
            style={{
              width: `${(currentTime / duration) * 100 || 0}%`,
            }}
          ></div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="text-zinc-400">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* AUDIO */}

      <audio ref={audioRef} src={currentSong?.audio} />
    </div>
  );
};

export default MusicPlayer;
