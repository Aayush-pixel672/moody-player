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
    <div className="min-h-screen bg-black px-4 py-6 text-white sm:px-6 md:p-10">
      <motion.div
        className="mx-auto max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-900 p-5 sm:p-8 lg:p-10"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 sm:text-sm">
            Admin Panel
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Upload New Song
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
            Add a new song to your AI-powered music library by filling in the
            details below.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4 sm:space-y-5">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Song Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm transition-all focus:border-purple-500 sm:px-5 sm:py-4 sm:text-base"
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
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm transition-all focus:border-purple-500 sm:px-5 sm:py-4 sm:text-base"
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
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/20 sm:p-8"
              >
                <ImagePlus
                  size={48}
                  className="mb-4 text-purple-400 sm:size-14"
                />

                <p className="text-center text-base font-semibold sm:text-lg">
                  Click to Upload Image
                </p>

                <p className="mt-2 text-center text-xs text-zinc-400 sm:text-sm">
                  JPG, PNG or WEBP
                </p>

                {preview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={preview}
                    alt="Preview"
                    className="mt-6 h-32 w-32 rounded-2xl border border-purple-500/20 object-cover shadow-lg sm:h-40 sm:w-40"
          
                  />
                )}

                {image && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 break-all text-center text-sm font-medium text-green-400"
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
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-pink-500 sm:p-8"
              >
                <Music4 size={48} className="mb-4 text-pink-400 sm:size-14" />

                <p className="text-center text-base font-semibold sm:text-lg">
                  Click to Upload Audio
                </p>

                <p className="mt-2 text-center text-xs text-zinc-400 sm:text-sm">
                  MP3, WAV
                </p>

                {audio && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 break-all text-center text-sm font-medium text-green-400"
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
            className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold shadow-xl shadow-purple-500/20 transition-all disabled:opacity-60 sm:py-4 sm:text-base"
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
