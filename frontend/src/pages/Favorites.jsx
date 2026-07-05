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
    <div className="min-h-screen bg-black text-white p-10">
      <div className="mb-12">
        <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
          Your Collection
        </p>

        <h1 className="text-5xl font-extrabold">Favorite Songs</h1>

        <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
          All the songs you've loved in one place. Enjoy quick access to your
          favorite tracks anytime.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 bg-pink-500/15 border border-pink-500/20 px-5 py-3 rounded-full">
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

          <h2 className="text-4xl font-bold mb-4">No Favorite Songs Yet</h2>

          <p className="text-zinc-400 text-center max-w-lg leading-8">
            Start adding songs to your favorites and build your own personal
            music collection.
          </p>

          <div className="mt-8 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-medium">
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
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-pink-500/40 rounded-3xl p-5 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10"
            initial={{ opacity: 0, y: 40 ,scale: 0.97}}
            animate={{ opacity: 1, y: 0,scale: 1}}
            transition={{ duration: 0.5, delay: index * 0.15,ease: "easeOut" }}
          >
            <img
              src={favorite.songId?.image}
              alt={favorite.songId?.title}
              className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-lg"
            />

            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {favorite.songId?.title}
                </h2>

                <p className="text-zinc-400 mt-1">{favorite.songId?.artist}</p>

                <span className="inline-block mt-4 px-3 py-1 rounded-full bg-pink-500/15 text-pink-400 text-xs font-medium">
                  {favorite.songId?.mood}
                </span>
              </div>

              <button
                onClick={() => removeFavorite(favorite._id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
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
