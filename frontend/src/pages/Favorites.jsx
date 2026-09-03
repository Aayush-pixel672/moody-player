import { useEffect, useState } from "react";
import api from "../services/api";
import { useMusic } from "../context/MusicContext";
import { Search, Play, Shuffle } from "lucide-react";
import Button from "../components/ui/Button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useMemo } from "react";
gsap.registerPlugin(useGSAP);
const Favorites = () => {
  const { setCurrentSong, setIsPlaying, setQueue, setCurrentIndex } =
    useMusic();
  const [favorites, setFavorites] = useState([]);
  const container = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get("/favorites");

        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((favorite) =>
      favorite.songId?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [favorites, searchTerm]);
  console.log(favorites);

  useGSAP(
    () => {
      if (!filteredFavorites.length) return;

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
          ".search-section",
          {
            opacity: 0,
            y: 30,
            duration: 0.45,
          },
          "-=0.35",
        )
        .from(
          ".favorite-card",
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
      dependencies: [filteredFavorites],
    },
  );

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);

      setFavorites((prev) =>
        prev.filter((favorite) => favorite._id !== favoriteId),
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const playSong = (song) => {
    const favoriteSongs = filteredFavorites
      .map((favorite) => favorite.songId)
      .filter(Boolean);

    const songIndex = favoriteSongs.findIndex(
      (favoriteSong) => favoriteSong._id === song._id,
    );

    if (songIndex === -1) return;

    setQueue(favoriteSongs);
    setCurrentIndex(songIndex);
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <div
      ref={container}
      className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 md:p-10"
    >
      <div className="hero relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.45)] mb-10">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Cover */}
          <div className="hero-icon h-36 w-36 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 flex items-center justify-center shadow-2xl">
            <span className="text-6xl">❤️</span>
          </div>

          {/* Content */}
          <div className="hero-content flex-1 text-center md:text-left">
            <p className="uppercase tracking-[4px] text-sm text-zinc-400">
              Your Collection
            </p>

            <h1 className="mt-2 text-4xl md:text-5xl font-bold">
              Favorite Songs
            </h1>

            <p className="mt-4 max-w-xl text-zinc-400">
              Every song you've loved is collected here. Jump back into your
              favorite music anytime.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
              <div>
                <p className="text-3xl font-bold">{favorites.length}</p>
                <p className="text-sm text-zinc-500">Favorites</p>
              </div>

              <div>
                <p className="text-3xl font-bold">❤️</p>
                <p className="text-sm text-zinc-500">Loved Songs</p>
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
            placeholder="Search favorites..."
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 outline-none transition focus:border-pink-500"
          />
        </div>

        {/* Buttons */}

        <div className="flex gap-3">
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              if (filteredFavorites.length === 0) return;

              playSong(filteredFavorites[0].songId);
            }}
          >
            <Play size={18} />
            Play All
          </Button>

          <Button
            variant="secondary"
            className="flex items-center gap-2"
            onClick={() => {
              if (filteredFavorites.length === 0) return;

              const randomIndex = Math.floor(
                Math.random() * filteredFavorites.length,
              );

              playSong(filteredFavorites[randomIndex].songId);
            }}
          >
            <Shuffle size={18} />
            Shuffle
          </Button>
        </div>
      </div>

      {/* NO SONGS */}

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-8xl mb-6">❤️</div>

          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">
            No Favorite Songs Yet
          </h2>

          <p className="max-w-lg text-center text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start adding songs to your favorites and build your own personal
            music collection.
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center rounded-full border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-center font-medium text-pink-400">
            Your favorite songs will appear here.
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Search className="mb-6 h-16 w-16 text-zinc-500" />

          <h2 className="mb-4 text-2xl font-bold">No Matching Favorites</h2>

          <p className="text-zinc-400">
            Try searching with a different song name.
          </p>
        </div>
      ) : (
        <div className="favorites-container space-y-5">
          {filteredFavorites.map((favorite) => (
            <div
              key={favorite._id}
              className="favorite-card flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <img
                src={favorite.songId?.image}
                alt={favorite.songId?.title}
                className="h-20 w-20 self-center rounded-2xl border border-white/10 object-cover shadow-lg sm:h-24 sm:w-24 sm:self-auto"
              />

              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white sm:text-xl lg:text-2xl">
                    {favorite.songId?.title}
                  </h2>

                  <p className="mt-1 truncate text-sm text-zinc-400 sm:text-base">
                    {favorite.songId?.artist}
                  </p>

                  <span className="mt-4 inline-block rounded-full bg-pink-500/15 px-3 py-1 text-xs font-medium text-pink-400">
                    {favorite.songId?.mood}
                  </span>
                </div>

                <button
                  onClick={() => playSong(favorite.songId)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2.5 shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 sm:w-auto"
                >
                  ▶ Play
                </button>

                <button
                  onClick={() => removeFavorite(favorite._id)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white sm:w-auto"
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
