import { useEffect, useState } from "react";
import { Music2, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./ui/Button";
import toast from "react-hot-toast";

import api from "../services/api";
import { createPortal } from "react-dom";
const PlaylistModal = ({ songId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlists");
      setPlaylists(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load playlists");
    }
  };

  const addSong = async (playlistId) => {
    try {
      await api.post("/playlists/add-song", {
        playlistId,
        songId,
      });

      toast.success("Song added to playlist");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add song");
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      return toast.error("Enter playlist name");
    }

    const exists = playlists.some(
      (playlist) =>
        playlist.name.trim().toLowerCase() ===
        newPlaylistName.trim().toLowerCase()
    );

    if (exists) {
      return toast.error("Playlist already exists");
    }

    try {
      const response = await api.post("/playlists", {
        name: newPlaylistName.trim(),
      });

      const playlist = response.data;

      await api.post("/playlists/add-song", {
        playlistId: playlist._id,
        songId,
      });

      toast.success("Playlist created & song added 🎉");

      setPlaylists((prev) => [...prev, playlist]);
      setNewPlaylistName("");
      setShowCreateForm(false);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create playlist");
    }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.92,
            y: 20,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-purple-500/10 backdrop-blur-xl"
        >
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400">
                <Music2 size={22} />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Add to Playlist
                </h2>

                <p className="text-xs sm:text-sm text-zinc-400">
                  Choose where to save this song
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* CONTENT */}

          <div className="p-5 sm:p-6">
            {/* PLAYLISTS */}

            <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <motion.button
                    key={playlist._id}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addSong(playlist._id)}
                    className="w-full rounded-2xl border border-white/5 bg-zinc-800/70 px-4 py-4 text-left font-medium text-white transition-all duration-300 hover:border-purple-500/30 hover:bg-purple-600/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                        <Music2 size={18} />
                      </div>

                      <span className="truncate">
                        {playlist.name}
                      </span>
                    </div>
                  </motion.button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-zinc-700 py-10 text-center">
                  <Music2
                    size={32}
                    className="mx-auto mb-3 text-zinc-600"
                  />

                  <p className="font-medium text-zinc-400">
                    No playlists found
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Create your first playlist below
                  </p>
                </div>
              )}
            </div>

            {/* CREATE PLAYLIST */}

            <div className="mt-5 border-t border-white/10 pt-5">
              <Button
                type="button"
                variant="secondary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowCreateForm(!showCreateForm)}
              >
                {showCreateForm ? (
                  <X size={18} />
                ) : (
                  <Plus size={18} />
                )}

                {showCreateForm
                  ? "Cancel"
                  : "Create New Playlist"}
              </Button>
            </div>

            {/* CREATE FORM */}

            <AnimatePresence initial={false}>
              {showCreateForm && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y:-10,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y:0,
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    y:-10,
                  }}
                  transition={{
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) =>
                        setNewPlaylistName(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          createPlaylist();
                        }
                      }}
                      placeholder="Enter playlist name"
                      autoFocus
                      className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                    />

                    <Button
                      type="button"
                      onClick={createPlaylist}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Create Playlist
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default PlaylistModal;