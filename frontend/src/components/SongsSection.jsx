import SongCard from "./SongCard";

const SongsSection = ({
  favorites,
  setFavorites,
  songs,
  setCurrentSong,
  mood
}) => {

  const filteredSongs = songs.filter(
    (song) => song.mood === mood
  );

  return (
    <div className="mt-20">

      <h1 className="text-4xl font-bold mb-10">
        Recommended Tracks
      </h1>

      <div className="space-y-5">

        {filteredSongs.map((song) => (

          <SongCard
            key={song._id}
            song={song}
            setCurrentSong={setCurrentSong}
            favorites={favorites}
            setFavorites={setFavorites}
          />

        ))}

      </div>

    </div>
  );
};

export default SongsSection;