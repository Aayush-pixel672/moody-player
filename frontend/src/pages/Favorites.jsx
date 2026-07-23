import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

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
  console.log(favorites);

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites(favorites.filter((favorite) => favorite._id !== favoriteId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 md:p-10">
      <div className="mb-12">
        <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
          Your Collection
        </p>

        <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">Favorite Songs</h1>

        <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
          All the songs you've loved in one place. Enjoy quick access to your
          favorite tracks anytime.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/15 px-4 py-2 sm:px-5 sm:py-3">
          <span className="text-2xl">❤️</span>

          <span className="font-semibold">
            {favorites.length} Favorite Songs
          </span>
        </div>
      </div>

      {/* NO SONGS */}

      {favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-8xl mb-6">❤️</div>

          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">No Favorite Songs Yet</h2>

          <p className="max-w-lg text-center text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Start adding songs to your favorites and build your own personal
            music collection.
          </p>

          <div className="mt-8 inline-flex flex-wrap items-center rounded-full border border-pink-500/20 bg-pink-500/10 px-5 py-3 text-center font-medium text-pink-400">
            Your favorite songs will appear here.
          </div>
        </div>
      )}

      {/* FAVORITE SONGS */}

      <motion.div className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{ duration: 0.5 }}>
        {favorites.map((favorite,index) => (
          <motion.div
            key={favorite._id}
            className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 transition-all duration-300 hover:border-pink-500/40 hover:shadow-xl hover:shadow-pink-500/10 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            initial={{ opacity: 0, y: 40 ,scale: 0.97}}
            animate={{ opacity: 1, y: 0,scale: 1}}
            transition={{ duration: 0.5, delay: index * 0.15,ease: "easeOut" }}
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

                <p className="mt-1 truncate text-sm text-zinc-400 sm:text-base">{favorite.songId?.artist}</p>

                <span className="mt-4 inline-block rounded-full bg-pink-500/15 px-3 py-1 text-xs font-medium text-pink-400">
                  {favorite.songId?.mood}
                </span>
              </div>

              <button
                onClick={() => removeFavorite(favorite._id)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white sm:w-auto"
              >
                🗑 Remove
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Favorites;
