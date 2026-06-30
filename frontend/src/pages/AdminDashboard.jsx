import { useEffect, useState } from "react";
import api from "../services/api";

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
      alert("Song Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
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

      alert("Song Updated Successfully");

      seteditSong(null);

      await fetchSongs();
    } catch (err) {
      console.log(err);

      alert("Update Failed");
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
      <h1 className="text-4xl font-bold text-purple-500 mb-10">
        Admin Dashboard
      </h1>
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-zinc-800 rounded-xl p-4 outline-none"
        />

        <select
          value={filterMood}
          onChange={(e) => setFilterMood(e.target.value)}
          className="bg-zinc-800 rounded-xl p-4 outline-none"
        >
          <option>All</option>

          <option>Happy</option>

          <option>Sad</option>

          <option>Angry</option>

          <option>Neutral</option>

          <option>Surprised</option>
        </select>
      </div>

      <div className="space-y-5">
        {filteredSongs.map((song) => (
          <div
            key={song._id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-2xl font-semibold">{song.title}</h2>

              <p className="text-zinc-400">{song.artist}</p>

              <p className="text-purple-400">{song.mood}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(song)}
                className="bg-yellow-500 px-5 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => deleteSong(song._id)}
                className="bg-red-600 px-5 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editSong && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-[450px]">
            <h2 className="text-3xl font-bold text-purple-500 mb-6">
              Edit Song
            </h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 p-4 rounded-xl mb-4 outline-none"
            />

            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-zinc-800 p-4 rounded-xl mb-4 outline-none"
            />

            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full bg-zinc-800 p-4 rounded-xl mb-6 outline-none"
            >
              <option>Happy</option>
              <option>Sad</option>
              <option>Angry</option>
              <option>Neutral</option>
              <option>Surprised</option>
            </select>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => seteditSong(null)}
                className="bg-zinc-700 px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateSong}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
