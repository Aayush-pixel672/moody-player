import { Heart, Play, Pause, Plus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import api from "../services/api";
import { useState } from "react";
import Card from "../components/UI/Card";
import Button from "./ui/Button";
import PlaylistModal from "./PlaylistModal";
const SongCard = ({
  song,
  favorites = [],
  setFavorites,
  setCurrentSong,
  currentSong,
  isPlaying,

  showFavorite = true,
  showPlaylistButton = true,
  showPlayButton = true,
  setStartDetection,
  showRemoveButton = false,
  onRemove,
}) => {
  const favoriteItem = favorites.find((fav) => fav?.songId?._id === song._id);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

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
    <>
      <Card
        className={`group p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-500/40 hover:shadow-[0_15px_40px_rgba(168,85,247,0.25)] ${
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
          {showFavorite && (
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
          )}

          {showPlaylistButton && (
            <motion.button
              whileHover={{
                scale: 1.2,
                rotate: 12,
              }}
              whileTap={{
                scale: 0.9,
              }}
              transition={{
                duration: 0.15,
              }}
              onClick={() => setShowPlaylistModal(true)}
              className="text-green-500"
            >
              <Plus size={28} />
            </motion.button>
          )}

          {showPlayButton && (
            <Button
              onClick={() => {
                setStartDetection(false);
                setCurrentSong(song);
              }}
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
          )}
          {showRemoveButton && (
            <Button
              onClick={onRemove}
              variant="danger"
              className="min-w-[140px]"
            >
              Remove
            </Button>
          )}
        </div>
      </Card>
      {showPlaylistModal && (
        <PlaylistModal
          songId={song._id}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </>
  );
};

export default SongCard;
