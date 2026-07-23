import SongCard from "./SongCard";
import Card from "../components/UI/Card";
import { useRef, useEffect } from "react";
import { animateSongCards } from "../animations";
const SongsSection = ({
  favorites,
  setFavorites,
  songs,
  setCurrentSong,
  currentSong,
  mood,
  isPlaying,
}) => {
  const songsGridRef = useRef(null);
  const filteredSongs = songs.filter((song) => song.mood === mood);
  useEffect(() => {
    if (filteredSongs.length === 0) return;

    animateSongCards({
      songsGridRef,
    });
  }, [filteredSongs]);
  return (
    <div className="mt-12 md:mt-20">
      <div ref={songsGridRef} className="space-y-5">
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <div key={song._id}>
              <SongCard
                song={song}
                setCurrentSong={setCurrentSong}
                currentSong={currentSong}
                favorites={favorites}
                setFavorites={setFavorites}
                isPlaying={isPlaying}
              />
            </div>
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center py-16 md:py-20 px-6">
            <div className="text-5xl md:text-7xl mb-6">
              {mood === "Detecting..." ? "😊" : "🎵"}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-3 text-center">
              {mood === "Detecting..."
                ? "Start Mood Detection"
                : "No Songs Found"}
            </h3>

            <p className="text-zinc-400 text-center text-sm md:text-base max-w-md leading-7">
              {mood === "Detecting..."
                ? "Click the 'Start Mood Detection' button above to get AI-powered music recommendations."
                : "No songs are available for your current mood. Try detecting your mood again."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SongsSection;
