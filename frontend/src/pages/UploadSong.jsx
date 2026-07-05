import { useState } from "react";
import { ImagePlus, Music4, UploadCloud, Loader2 } from "lucide-react";
import api from "../services/api";
import MoodDropdown from "../components/UI/MoodDropdown";
import Input from "../components/UI/Input";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
const UploadSong = () => {
  const [title, setTitle] = useState("");

  const [artist, setArtist] = useState("");

  const [mood, setMood] = useState("Happy");

  const [image, setImage] = useState(null);

  const [audio, setAudio] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("mood", mood);
    formData.append("image", image);
    formData.append("audio", audio);

    try {
      const response = await api.post("/songs", formData);

      console.log(response.data);

      toast.success("Song Uploaded Successfully 🎉");

      setTitle("");
      setArtist("");
      setMood("Happy");
      setImage(null);
      setAudio(null);
      setPreview("");
    } catch (error) {
      console.error(error);

      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <motion.div
        className="max-w-2xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-10"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-10">
          <p className="text-purple-400 font-semibold tracking-[0.25em] uppercase mb-2">
            Admin Panel
          </p>

          <h1 className="text-5xl font-extrabold">Upload New Song</h1>

          <p className="text-zinc-400 mt-4 text-lg leading-8">
            Add a new song to your AI-powered music library by filling in the
            details below.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-5">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-purple-500 transition-all"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Artist Name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-purple-500 transition-all"
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <MoodDropdown value={mood} onChange={setMood} />
          </motion.div>

          <div>
            <p className="text-sm font-medium text-zinc-400 mb-3">
              Album Cover
            </p>

            <label className="cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="border-2 border-dashed border-zinc-700 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 bg-zinc-900/50"
              >
                <ImagePlus size={56} className="text-purple-400 mb-4" />

                <p className="font-semibold text-lg">Click to Upload Image</p>

                <p className="text-zinc-400 text-sm mt-2">JPG, PNG or WEBP</p>

                {preview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={preview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-2xl mt-6 border border-purple-500/20 shadow-lg"
                  />
                )}

                {image && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-green-400 text-sm font-medium"
                  >
                    ✅ {image.name}
                  </motion.p>
                )}
              </motion.div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (!file) return;

                  setImage(file);

                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-400 mb-3">Audio File</p>

            <label className="cursor-pointer">
              <motion.div 
                whileHover = {{scale:1.02}}
                transition={{ duration: 0.25 }}
                className="border-2 border-dashed border-zinc-700 hover:border-pink-500 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 bg-zinc-900/50"
              >
                <Music4 size={56} className="text-pink-400 mb-4" />

                <p className="font-semibold text-lg">Click to Upload Audio</p>

                <p className="text-zinc-400 text-sm mt-2">MP3, WAV</p>

                {audio && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-green-400 text-sm font-medium"
                  >
                    ✅ {audio.name}
                  </motion.p>
                )}
              </motion.div>

              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setAudio(e.target.files[0])}
              />
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-500 py-4 rounded-2xl font-semibold flex justify-center items-center gap-3 shadow-xl shadow-purple-500/20 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={20} />
                Upload Song
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadSong;
