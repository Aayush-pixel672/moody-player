import SongCard from "./SongCard"
import songsData from "../utils/songsData"

const SongsSection = ({ setCurrentSong,mood }) => {

  const filteredSongs = songsData.filter(song => song.mood === mood)

  return (

    <div className="mt-20">

      <h1 className="text-4xl font-bold mb-10">

        Recommended Tracks

      </h1>

      <div className="space-y-5">

        {filteredSongs.map((song) => (

          <SongCard
            key={song.id}
            song={song}
            setCurrentSong={setCurrentSong}
          />

        ))}

      </div>

    </div>
  )
}

export default SongsSection