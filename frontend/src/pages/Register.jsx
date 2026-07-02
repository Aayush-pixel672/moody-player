import { useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";

const UploadSong = () => {
  const [title, setTitle] = useState("");

  const [artist, setArtist] = useState("");

  const [mood, setMood] = useState("Happy");

  const [image, setImage] = useState(null);

  const [audio, setAudio] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("mood", mood);
    formData.append("image", image);
    formData.append("audio", audio);

    try {
      setLoading(true);

      await api.post("/songs", formData);

      toast.success("Song Uploaded Successfully");

      setTitle("");
      setArtist("");
      setMood("Happy");
      setImage(null);
      setAudio(null);
    } catch (error) {
      console.error(error);

      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex justify-center items-center px-5 py-10">

      <Card className="w-full max-w-2xl p-10">

        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Upload Song
        </h1>

        <form
          onSubmit={handleUpload}
          className="space-y-5"
        >

          <Input
            placeholder="Song Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Artist Name"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />

          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full rounded-2xl bg-zinc-900 border border-zinc-700 px-5 py-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
          >
            <option>Happy</option>
            <option>Sad</option>
            <option>Angry</option>
            <option>Neutral</option>
            <option>Surprised</option>
          </select>

          <div>

            <p className="mb-2 text-zinc-400">
              Song Image
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-zinc-300"
            />

          </div>

          <div>

            <p className="mb-2 text-zinc-400">
              Song Audio
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files[0])}
              className="text-zinc-300"
            />

          </div>

          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={22} />
                Uploading...
              </>
            ) : (
              "Upload Song"
            )}
          </Button>

        </form>

      </Card>

    </div>
  );
};

export default UploadSong;