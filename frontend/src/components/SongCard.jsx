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
  isPlaying,
}) => {
  const favoriteItem = favorites.find((fav) => fav?.songId?._id === song._id);

  const isFavorite = !!favoriteItem;

  const isCurrentSong = currentSong?._id === song._id;

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
      className={`p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20 ${
        isCurrentSong && isPlaying
          ? "border-purple-500 shadow-lg shadow-purple-500/30"
          : ""
      }`}
    >
      {/* LEFT */}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
        <motion.img
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 0.2,
          }}
          src={song.image}
          alt={song.title}
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg"
        />

        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center sm:text-left">
            {song.title}
          </h2>

          <p className="text-zinc-400 text-center sm:text-left">
            {song.artist}
          </p>

          <span className="inline-block mt-3 px-4 py-1 rounded-full text-xs bg-purple-600/20 text-purple-400 border border-purple-500/20">
            {song.mood}
          </span>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center justify-center md:justify-end gap-4 w-full md:w-auto">
        <motion.button
          whileHover={{
            scale: 1.2,
            rotate: -12,
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
          variant={isCurrentSong && isPlaying ? "success" : "primary"}
          className="flex items-center justify-center gap-2 min-w-[140px]"
        >
          {isCurrentSong && isPlaying ? (
            <Pause size={18} />
          ) : (
            <Play size={18} />
          )}

          {isCurrentSong && isPlaying ? "Playing" : "Play"}
        </Button>
      </div>
    </Card>
  );
};

export default SongCard;
