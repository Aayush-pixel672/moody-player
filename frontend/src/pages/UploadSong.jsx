import { useState } from "react";

import api from "../services/api";

const UploadSong = () => {
  const [title, setTitle] = useState("");

  const [artist, setArtist] = useState("");

  const [mood, setMood] = useState("Happy");

  const [image, setImage] = useState(null);

  const [audio, setAudio] = useState(null);

  

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // ye humara bana
    formData.append("title", title);

    formData.append("artist", artist);

    formData.append("mood", mood);

    formData.append("image", image);

    formData.append("audio", audio);

    try {
      const response = await api.post("/songs", formData);
      console.log(response.data);
      alert("Song uploaded successfully");
      setTitle("");
      setArtist("");

      setMood("Happy");

      setImage(null);

      setAudio(null);
    } catch (error) {
      console.error(error);
      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-10">
        <h1 className="text-4xl font-bold text-purple-500 mb-8">Upload Song</h1>

        <form onSubmit={handleUpload} className="space-y-5">
          <input
            type="text"
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-800 p-4 rounded-xl outline-none"
          />

          <input
            type="text"
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full bg-zinc-800 p-4 rounded-xl outline-none"
          />

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full bg-zinc-800 p-4 rounded-xl outline-none"
          >
            <option>Happy</option>

            <option>Sad</option>

            <option>Angry</option>

            <option>Neutral</option>

            <option>Surprised</option>
          </select>

          <div>
            <p className="mb-2 text-zinc-400">Song Image</p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <div>
            <p className="mb-2 text-zinc-400">Song Audio</p>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-semibold transition"
          >
            Upload Song
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;
