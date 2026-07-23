import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { gsap } from "gsap";
const MusicPlayer = ({
  currentSong,
  setCurrentSong,
  songsData,
  isPlaying,
  setIsPlaying,
}) => {
  const audioRef = useRef(null);
  const albumArtRef = useRef(null);
  const rotationTweenRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("volume");
    return savedVolume ? Number(savedVolume) : 1;
  });
  const [isShuffle, setIsShuffle] = useState(() => {
    return localStorage.getItem("shuffle") === "true";
  });
  const [isRepeat, setIsRepeat] = useState(() => {
    return localStorage.getItem("repeat") === "true";
  });

  const playNextSong = () => {
    if (!currentSong || songsData.length === 0) return;

    // Repeat Mode
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    // Shuffle Mode
    if (isShuffle) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * songsData.length);
      } while (
        songsData.length > 1 &&
        songsData[randomIndex]._id === currentSong._id
      );

      setCurrentSong(songsData[randomIndex]);
      return;
    }

    // Normal Mode
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

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
    localStorage.setItem("volume", volume);
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("repeat", isRepeat);
  }, [isRepeat]);

  useEffect(() => {
    localStorage.setItem("shuffle", isShuffle);
  }, [isShuffle]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !currentSong) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: "Moody Player",
      artwork: [
        {
          src: currentSong.image,
          sizes: "512x512",
          type: "image/jpeg",
        },
      ],
    });
  }, [currentSong]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => {
      togglePlay();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      togglePlay();
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      playNextSong();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      playPreviousSong();
    });
  }, [isPlaying, currentSong]);

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
    localStorage.setItem("lastPlayedSong", JSON.stringify(currentSong));
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

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts while typing
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          playNextSong();
          break;

        case "ArrowLeft":
          playPreviousSong();
          break;

        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => Math.min(prev + 0.1, 1));
          break;

        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => Math.max(prev - 0.1, 0));
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, currentSong, volume, isShuffle, isRepeat]);

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

  useEffect(() => {
    if (!albumArtRef.current) return;

    if (isPlaying) {
      // Stop any previous animations
      gsap.killTweensOf(albumArtRef.current);

      // Make album art circular
      gsap.to(albumArtRef.current, {
        borderRadius: "9999px",
        duration: 0.4,
        ease: "power2.out",
      });

      // Remove old rotation tween if any
      rotationTweenRef.current?.kill();

      // Create a new infinite rotation
      rotationTweenRef.current = gsap.to(albumArtRef.current, {
        rotation: "+=360",
        duration: 10,
        ease: "none",
        repeat: -1,
        transformOrigin: "center center",
      });
    } else {
      // Stop all running animations
      gsap.killTweensOf(albumArtRef.current);

      // Stop rotation
      rotationTweenRef.current?.kill();

      // Return to initial position and square shape
      gsap.to(albumArtRef.current, {
        rotation: 0,
        borderRadius: "1rem",
        duration: 0.5,
        ease: "power2.out",
      });
    }

    return () => {
      rotationTweenRef.current?.kill();
    };
  }, [isPlaying]);

  const handleSeek = (e) => {
    updateSeekPosition(e.clientX);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSeekPosition(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    updateSeekPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateSeekPosition = (clientX) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();

    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);

    const percentage = x / rect.width;

    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // FORMAT TIME
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const formatTime = (time) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 border-t border-white/10 bg-zinc-950/80 px-3 py-2 shadow-2xl backdrop-blur-xl sm:px-4 sm:py-3 md:px-6 lg:px-8 lg:py-4">
      {/* LEFT */}

      <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
        <div className="relative">
          <img
            ref={albumArtRef}
            src={
              currentSong?.image ||
              "https://images.unsplash.com/photo-1511379938547-c1f69419868d"
            }
            alt={currentSong?.title || "Album Art"}
            className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover border border-white/10 shadow-lg transition-all duration-500"
          />

          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-pulse border-2 border-zinc-950" />
          )}
        </div>

        <div className="max-w-[120px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[220px]">
          <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-purple-400 sm:text-[9px] lg:text-[10px]">
            {!currentSong ? "No Song" : isPlaying ? "Now Playing" : "Paused"}
          </p>
          <h2 className="truncate text-sm font-bold text-white sm:text-base lg:text-lg">
            {currentSong?.title || "No Song Selected"}
          </h2>

          <p className="mt-1 truncate text-xs text-zinc-400 sm:text-sm">
            {currentSong?.artist || "Unknown Artist"}
          </p>

          <span className="mt-2 inline-block rounded-full bg-purple-500/15 px-2 py-1 text-[10px] font-medium text-purple-400 sm:px-3 sm:text-xs">
            {currentSong?.mood || "No Mood"}
          </span>
        </div>
      </div>

      {/* CENTER */}

      <div className="flex w-[50%] flex-col items-center sm:w-[45%] md:w-[42%] lg:w-[40%]">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              isRepeat
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                : "bg-white/5 hover:bg-purple-600/20"
            }`}
          >
            <Repeat size={18} />
          </button>

          <button
            onClick={playPreviousSong}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:scale-110 hover:bg-purple-600/20 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
          >
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-110 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={playNextSong}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:scale-110 hover:bg-purple-600/20 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
          >
            <SkipForward size={22} />
          </button>
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
              isShuffle
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/40"
                : "bg-white/5 hover:bg-purple-600/20"
            }`}
          >
            <Shuffle size={18} />
          </button>
        </div>

        {/* PROGRESS BAR */}

        <div className="mt-3 flex w-full items-center gap-2 sm:mt-4 sm:gap-3 lg:mt-5">
          <span className="w-8 text-right text-[10px] text-zinc-400 sm:w-10 sm:text-xs">
            {formatTime(currentTime)}
          </span>

          <div
            ref={progressBarRef}
            onClick={handleSeek}
            onMouseDown={handleMouseDown}
            className="h-2 flex-1 cursor-pointer overflow-hidden rounded-full bg-zinc-800/80 shadow-inner sm:h-2.5"
          >
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
              style={{
                width: `${progress}%`,
              }}
            >
              <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-pink-500 shadow-lg transition-transform duration-200 hover:scale-110" />
            </div>
          </div>

          <span className="w-8 text-[10px] text-zinc-400 sm:w-10 sm:text-xs">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      {/* RIGHT */}

      <div className="hidden md:flex items-center gap-3 w-40">
        <button
          onClick={() => setVolume(volume === 0 ? 1 : 0)}
          className="text-zinc-300 hover:text-white transition"
        >
          {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
      </div>

      {/* AUDIO */}

      <audio ref={audioRef} src={currentSong?.audio} onEnded={playNextSong} />
    </div>
  );
};

export default MusicPlayer;
