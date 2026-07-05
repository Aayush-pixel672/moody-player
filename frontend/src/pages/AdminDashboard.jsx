import { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import MoodDropdown from "../components/UI/MoodDropdown";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const AdminDashboard = () => {
  const [songs, setSongs] = useState([]);

  const [editSong, seteditSong] = useState(null);

  const [title, setTitle] = useState("");

  const [artist, setArtist] = useState("");

  const [mood, setMood] = useState("");

  const [search, setSearch] = useState("");

  const [filterMood, setFilterMood] = useState("All");

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await api.get("/songs");

      setSongs(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSong = async (id) => {
    try {
      await api.delete(`/songs/${id}`);
      await fetchSongs();
      toast.success("Song Deleted Successfully");
    } catch (err) {
      console.log(err);
      toast.error("Delete Failed");
    }
  };

  const handleEdit = (song) => {
    seteditSong(song);

    setTitle(song.title);

    setArtist(song.artist);

    setMood(song.mood);
  };

  const updateSong = async () => {
    try {
      await api.put(`/songs/${editSong._id}`, {
        title,
        artist,
        mood,
      });

      toast.success("Song Updated Successfully");

      seteditSong(null);

      await fetchSongs();
    } catch (err) {
      console.log(err);

      toast.error("Update Failed");
    }
  };

  const filteredSongs = songs.filter((song) => {
    const matchSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase());

    const matchMood =
      filterMood === "All" ||
      song.mood.toLowerCase() === filterMood.toLowerCase();

    return matchSearch && matchMood;
  });

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="mb-12">
        <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
          Admin Panel
        </p>

        <h1 className="text-5xl font-extrabold">Manage Songs</h1>

        <p className="text-zinc-400 mt-4 text-lg max-w-2xl">
          Manage your music library, update song information, filter tracks and
          keep your collection organized.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-6 mb-10">
        <Card className="p-6">
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            Total Songs
          </p>

          <h2 className="text-4xl font-bold text-purple-400 mt-3">
            {songs.length}
          </h2>
        </Card>

        <Card className="p-6">
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            Mood Categories
          </p>

          <h2 className="text-4xl font-bold text-pink-400 mt-3">
            {[...new Set(songs.map((song) => song.mood))].length}
          </h2>
        </Card>

        <Card className="p-6">
          <p className="text-zinc-400 text-sm uppercase tracking-wider">
            Artists
          </p>

          <h2 className="text-4xl font-bold text-green-400 mt-3">
            {[...new Set(songs.map((song) => song.artist))].length}
          </h2>
        </Card>
      </div>
      <div className="flex gap-5 mb-10">
        <Input
          type="text"
          placeholder="🔍 Search songs or artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-zinc-900/70 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-purple-500 transition-all"
        />

        <MoodDropdown value={filterMood} onChange={setFilterMood} />
      </div>

      <motion.div
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {filteredSongs.length > 0 ? (
          filteredSongs.map((song, index) => (
            <motion.div
              key={song._id}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
              }}
            >
              <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 hover:border-purple-500/40 rounded-3xl p-5 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {song.title}
                  </h2>

                  <p className="text-zinc-400 mt-1">{song.artist}</p>

                  <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 text-xs font-medium">
                    {song.mood}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(song)}
                    className="px-5"
                  >
                    ✏️ Edit
                  </Button>

                  <Button
                    onClick={() => deleteSong(song._id)}
                    variant="danger"
                    className="px-5"
                  >
                    🗑 Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="flex flex-col items-center justify-center py-24">
            <div className="text-7xl mb-6">🎵</div>

            <h2 className="text-3xl font-bold mb-4">No Songs Found</h2>

            <p className="text-zinc-400 text-center max-w-lg leading-8">
              No songs match your current search or mood filter.
            </p>
          </Card>
        )}
      </motion.div>
      {editSong && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-purple-500/20 rounded-3xl p-8 w-[500px] shadow-2xl shadow-purple-500/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-purple-500">Edit Song</h2>

              <button
                onClick={() => seteditSong(null)}
                className="w-10 h-10 rounded-full hover:bg-zinc-800 transition flex items-center justify-center text-zinc-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm font-medium text-zinc-400 mb-2">Song Title</p>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-purple-500 transition-all mb-4"
            />
            <p className="text-sm font-medium text-zinc-400 mb-2">
              Artist Name
            </p>
            <Input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl px-5 py-4 mb-4 focus:border-purple-500 transition-all"
            />
            <p className="text-sm font-medium text-zinc-400 mb-2">
              Mood Category
            </p>
            <div className="mb-4">
              <MoodDropdown value={mood} onChange={setMood} />
            </div>

            <div className="flex justify-end gap-4">
              <Button onClick={() => seteditSong(null)} variant="secondary">
                Cancel
              </Button>

              <Button
                onClick={updateSong}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg"
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
