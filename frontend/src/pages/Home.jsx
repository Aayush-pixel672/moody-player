import Navbar from "../components/Navbar";
import SongsSection from "../components/SongsSection";
import MusicPlayer from "../components/MusicPlayer";
import { useState, useEffect } from "react";
//import songsData from "../utils/songsData"
import FacialExpression from "../components/FacialExpression";
import api from "../services/api";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useRef } from "react";
import { animateHero, animateStatsCards, fadeOnScroll } from "../animations";
import { useGSAP } from "@gsap/react";

const Home = ({ currentSong, setCurrentSong }) => {
  const [mood, setMood] = useState("Detecting...");

  const [startDetection, setStartDetection] = useState(false);

  const [songs, setSongs] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);

  const heroLeftRef = useRef(null);

  const heroRightRef = useRef(null);

  const statsRef = useRef(null);

  const songsSectionRef = useRef(null);

  const moodEmoji = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    neutral: "😐",
    surprised: "😲",
  };

  const emoji = moodEmoji[mood.toLowerCase()] || "🎵";

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.get("/songs");
        setSongs(response.data);
        const savedSong = localStorage.getItem("lastPlayedSong");

        if (savedSong) {
          const parsedSong = JSON.parse(savedSong);

          const song = response.data.find(
            (item) => item._id === parsedSong._id,
          );

          if (song) {
            setCurrentSong(song);
          }
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites"); // ye api call se hum apne backend se favorites ko fetch karenge
        setFavorites(response.data); // ye response.data me se favorites ko setFavorites me set karenge taki hum apne component me use kar sake
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  useGSAP(() => {
    animateHero({
      heroLeftRef,
      heroRightRef,
    });

    animateStatsCards({
      statsRef,
    });

    fadeOnScroll(songsSectionRef);
  }, []);

  return (
    <div className="min-h-screen pb-32 bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10">
        {/* HERO SECTION */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-20">
          {/* LEFT */}

          <div ref={heroLeftRef}>
            <p className="hero-badge text-purple-400 font-semibold tracking-[0.3em] uppercase mb-4">
              AI Powered Music Recommendation
            </p>

            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Discover Music
              <span className="block bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Through Your Mood
              </span>
            </h1>

            <p className="hero-desc mt-6 text-base sm:text-lg lg:text-xl text-zinc-400 leading-7 lg:leading-8 max-w-xl">
              Detect your emotions in real time using AI and instantly receive
              music recommendations that perfectly match your mood.
            </p>

            <div className="hero-btn mt-8">
              <Button
                size="lg"
                onClick={() => setStartDetection(true)}
                className="w-full sm:w-auto"
              >
                Start Mood Detection
              </Button>
            </div>

            <div className="mt-8">
              <p className="text-zinc-400 font-medium">Current Mood</p>

              <div className="hero-mood inline-flex flex-wrap items-center gap-3 mt-3 bg-purple-600/20 border border-purple-500/30 rounded-full px-5 py-3">
                <span className="text-2xl">{emoji}</span>

                <span className="text-lg sm:text-xl font-semibold capitalize">
                  {mood}
                </span>
              </div>
            </div>
            <div
              ref={statsRef}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
            >
              <Card className="p-5 text-center">
                <h3 className="text-3xl font-bold text-purple-400">5+</h3>
                <p className="text-zinc-400 mt-2 text-sm">Mood Categories</p>
              </Card>

              <Card className="p-5 text-center">
                <h3 className="text-3xl font-bold text-pink-400">
                  {songs.length}+
                </h3>
                <p className="text-zinc-400 mt-2 text-sm">Songs Available</p>
              </Card>

              <Card className="p-5 text-center">
                <h3 className="text-3xl font-bold text-green-400">AI</h3>
                <p className="text-zinc-400 mt-2 text-sm">Powered</p>
              </Card>
            </div>
          </div>

          {/* RIGHT */}

          <Card
            ref={heroRightRef}
            className="relative overflow-hidden p-4 sm:p-6 border border-purple-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-2xl shadow-purple-500/10 w-full"
          >
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Live Mood Detection
            </h2>
            <p className="text-zinc-400 mb-5">
              Let AI analyze your facial expression in real time.
            </p>

            <div className="flex items-center gap-2 mb-5">
              <div
                className={`w-3 h-3 rounded-full ${
                  startDetection ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />

              <span className="text-sm text-zinc-400">
                {startDetection ? "AI is Detecting..." : "Waiting to Start"}
              </span>
            </div>

            <FacialExpression
              setMood={setMood}
              startDetection={startDetection}
            />

            {/* Status Indicator */}
          </Card>
        </div>

        {/* SONGS SECTION */}

        <div ref={songsSectionRef} className="mb-10">
          <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
            Personalized Playlist
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold">Recommended Songs</h2>

          <p className="text-zinc-400 mt-3 max-w-2xl text-sm sm:text-base">
            These songs are recommended based on your current mood detected by
            our AI.
          </p>
        </div>

        <SongsSection
          songs={songs}
          favorites={favorites}
          setFavorites={setFavorites}
          setCurrentSong={setCurrentSong}
          currentSong={currentSong}
          mood={mood}
          isPlaying={isPlaying}
        />
      </div>
      {/* MUSIC PLAYER */}

      <MusicPlayer
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songsData={songs}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
};

export default Home;
