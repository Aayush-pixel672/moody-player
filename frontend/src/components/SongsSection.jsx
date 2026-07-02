import SongCard from "./SongCard";
import { motion } from "framer-motion";
import Card from "../components/UI/Card"
const SongsSection = ({
  favorites,
  setFavorites,
  songs,
  setCurrentSong,
  currentSong,
  mood,
}) => {
  const filteredSongs = songs.filter((song) => song.mood === mood);

  return (
    <div className="mt-20">
      <motion.div className="space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song,index) => (
            <motion.div
              key={song._id}
              initial={{ opacity: 0, y: 40,scale: 0.97 }}
              animate={{ opacity: 1, y: 0,scale:1 }}
              transition={{ delay:index*0.20, duration: 0.7,ease: "easeOut" }}
            >
              <SongCard
                song={song}
                setCurrentSong={setCurrentSong}
                currentSong={currentSong}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            </motion.div>
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center py-20">
            <div className="text-7xl mb-6">
              {mood === "Detecting..." ? "😊" : "🎵"}
            </div>

            <h3 className="text-3xl font-bold mb-3">
              {mood === "Detecting..."
                ? "Start Mood Detection"
                : "No Songs Found"}
            </h3>

            <p className="text-zinc-400 text-center max-w-md leading-7">
              {mood === "Detecting..."
                ? "Click the 'Start Mood Detection' button above to get AI-powered music recommendations."
                : "No songs are available for your current mood. Try detecting your mood again."}
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default SongsSection;
