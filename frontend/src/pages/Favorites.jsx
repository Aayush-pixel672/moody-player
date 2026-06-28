import { useEffect, useState } from "react";
import api from "../services/api";

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
      <h1 className="text-5xl font-bold mb-10">
        Favorite Songs ❤️ ({favorites.length})
      </h1>

      {/* NO SONGS */}

      {favorites.length === 0 && (
        <h2 className="text-zinc-400 text-xl">No favorite songs yet. </h2>
        
        
      )}

      {/* FAVORITE SONGS */}

      <div className="space-y-5">
        {favorites.map((favorite) => (
          <div
            key={favorite._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-5"
          >
            <img
              src={favorite.songId?.image}
              alt=""
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex justify-between items-center w-full">
              <div>
                <h2 className="text-2xl font-semibold">
                  {favorite.songId?.title}
                </h2>

                <p className="text-zinc-400">{favorite.songId?.artist}</p>
              </div>

              <button
                onClick={() => removeFavorite(favorite._id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
