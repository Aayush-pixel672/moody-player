import { Heart } from "lucide-react";
import api from "../services/api";

const SongCard = ({
  song,
  favorites,
  setFavorites,
  setCurrentSong
}) => {

  const favoriteItem = favorites.find(
  (fav) => fav?.songId?._id === song._id
);

  const isFavorite = !!favoriteItem;

  const addToFavorites = async () => {

    try {

      if (!isFavorite) {

        const response = await api.post("/favorites", {
          songId: song._id
        });

        setFavorites([
          ...favorites,
          {
            ...response.data,
            songId: song
          }
        ]);

      } else {

        await api.delete(
          `/favorites/${favoriteItem._id}`
        );

        setFavorites(
          favorites.filter(
            (fav) =>
              fav._id !== favoriteItem._id
          )
        );

      }

    } catch (error) {

      console.error("Favorite Error:", error);

    }
  };

  return (

    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-purple-500 hover:scale-[1.02] transition duration-300">

      <div className="flex items-center gap-5">

        <img
          src={song.image}
          alt=""
          className="w-20 h-20 object-cover rounded-xl"
        />

        <div>

          <h2 className="text-xl font-semibold">
            {song.title}
          </h2>

          <p className="text-zinc-400">
            {song.artist}
          </p>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex items-center gap-4">

        {/* FAVORITE BUTTON */}

        <button
          onClick={addToFavorites}
          className="text-pink-500 hover:scale-110 transition"
        >

          <Heart
            size={26}
            fill={isFavorite ? "currentColor" : "none"}
          />

        </button>

        {/* PLAY BUTTON */}

        <button
          onClick={() => setCurrentSong(song)}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl transition"
        >

          Play

        </button>

      </div>

    </div>
  );
};

export default SongCard;