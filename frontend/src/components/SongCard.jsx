import { Heart, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../services/api";

import Card from "../components/UI/Card";
import Button from "./ui/Button";

const SongCard = ({
  song,
  favorites,
  setFavorites,
  setCurrentSong,
  currentSong,
}) => {
  const favoriteItem = favorites.find((fav) => fav?.songId?._id === song._id);

  const isFavorite = !!favoriteItem;

  const isPlaying = currentSong?._id === song._id;

  const addToFavorites = async () => {
    try {
      if (!isFavorite) {
        const response = await api.post("/favorites", {
          songId: song._id,
        });

        setFavorites([
          ...favorites,
          {
            ...response.data,
            songId: song,
          },
        ]);

        toast.success("Added to Favorites ❤️");
      } else {
        await api.delete(`/favorites/${favoriteItem._id}`);

        setFavorites(favorites.filter((fav) => fav._id !== favoriteItem._id));

        toast.success("Removed from Favorites");
      }
    } catch (error) {
      console.error(error);

      toast.error("Favorite Action Failed");
    }
  };

  return (
    <Card
      className={`p-5 flex justify-between items-center transition-all duration-300 ${
        isPlaying ? "border-purple-500 shadow-lg shadow-purple-500/30" : ""
      }`}
    >
      {/* LEFT */}

      <div className="flex items-center gap-5">
        <motion.img
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.2,
          }}
          src={song.image}
          alt={song.title}
          className="w-20 h-20 rounded-2xl object-cover"
        />

        <div>
          <h2 className="text-2xl font-semibold text-white">{song.title}</h2>

          <p className="text-zinc-400">{song.artist}</p>

          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs bg-purple-600/20 text-purple-400">
            {song.mood}
          </span>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{
            scale: 1.2,
          }}
          whileTap={{
            scale: 0.9,
          }}
          transition={{
            duration: 0.15,
          }}
          onClick={addToFavorites}
          className="text-pink-500"
        >
          <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
        </motion.button>

        <Button
          onClick={() => setCurrentSong(song)}
          variant={isPlaying ? "success" : "primary"}
          className="flex items-center gap-2"
        >
          <Play size={18} />

          {isPlaying ? <Pause size={18} /> : <Play size={18} />}

          {isPlaying ? "Playing" : "Play"}
        </Button>
      </div>
    </Card>
  );
};

export default SongCard;
