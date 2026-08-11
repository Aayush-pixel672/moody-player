import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Music2, Play, Shuffle, Pencil, Check, X } from "lucide-react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import SongCard from "../components/SongCard";
import api from "../services/api";
import { useMusic } from "../context/MusicContext";
import Button from "../components/ui/Button";
import { motion } from "framer-motion";
gsap.registerPlugin(useGSAP);
const PlaylistDetails = () => {
  const container = useRef(null);
  const { id } = useParams();

  const { currentSong, setCurrentSong, isPlaying } = useMusic();

  const [playlist, setPlaylist] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const response = await api.get(`/playlists/${id}`);
      setPlaylist(response.data);
      setEditedName(response.data.name);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load playlist");
    }
  };

  const removeSong = async (songId) => {
    try {
      await api.delete(`/playlists/${id}/songs/${songId}`);

      setPlaylist((prev) => ({
        ...prev,
        songs: prev.songs.filter((song) => song._id !== songId),
      }));

      toast.success("Song removed from playlist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove song");
    }
  };

  const renamePlaylist = async () => {
    if (!editedName.trim()) {
      return toast.error("Playlist name cannot be empty");
    }
    if (editedName.trim() === playlist.name) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await api.patch(`/playlists/${id}`, {
        name: editedName,
      });

      setPlaylist(response.data.playlist);
      setEditedName(response.data.playlist.name);
      setIsEditing(false);

      toast.success("Playlist renamed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to rename playlist");
    }
  };

  useGSAP(
    () => {
      if (!playlist) return;
      console.log("song cards:", gsap.utils.toArray(".song-card"));

      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.from(".playlist-cover", {
        scale: 0.6,
        opacity: 0,
        rotate: -15,
        duration: 0.7,
      })
        .from(
          ".playlist-title",
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.35",
        )
        .from(
          ".playlist-count",
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.3",
        )
        .from(
          ".playlist-actions",
          {
            y: 20,
            opacity: 0,
            duration: 0.45,
          },
          "-=0.2",
        )
        .fromTo(
          ".song-card",
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "opacity,transform",
          },
        );
    },
    {
      scope: container,
      dependencies: [playlist],
    },
  );

  if (!playlist) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-gray-400 animate-pulse">
          Loading Playlist...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={container}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header (Ready for GSAP) */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl overflow-hidden relative mb-10">
        <motion.div
          whileHover={{
            scale: 1.05,
            rotate: 2,
          }}
          transition={{
            duration: 0.25,
          }}
          className="playlist-cover relative h-36 w-36 md:h-48 md:w-48 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl shrink-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-75" />

          <Music2 className="relative w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-2xl" />
        </motion.div>
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="flex-1 text-center md:text-left">
          <p className="uppercase tracking-[4px] text-sm text-gray-400">
            Playlist
          </p>

          <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-purple-600/20 text-purple-300 text-xs font-medium border border-purple-500/20">
            Your Collection
          </span>

          <div className="playlist-title mt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            {isEditing ? (
              <>
                <input
                  value={editedName}
                  ref={inputRef}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renamePlaylist();
                  }}
                  className="rounded-xl border border-purple-500 bg-zinc-900 px-4 py-2 text-2xl md:text-4xl font-bold outline-none"
                />

                <button
                  onClick={renamePlaylist}
                  className="rounded-lg p-2 bg-green-500/20 hover:bg-green-500/30"
                >
                  <Check size={20} className="text-green-400" />
                </button>

                <button
                  onClick={() => {
                    setEditedName(playlist.name);
                    setIsEditing(false);
                  }}
                  className="rounded-lg p-2 bg-red-500/20 hover:bg-red-500/30"
                >
                  <X size={20} className="text-red-400" />
                </button>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold break-words">
                  {playlist.name}
                </h1>

                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg p-2 hover:bg-purple-600/20 transition"
                >
                  <Pencil size={18} className="text-purple-400" />
                </button>
              </>
            )}
          </div>

          <p className="playlist-count mt-4 text-sm md:text-base text-zinc-400">
            {playlist.songs.length}{" "}
            {playlist.songs.length === 1 ? "Song" : "Songs"}
            <span className="mx-2">•</span>
            Created by You
          </p>
          <div className="playlist-actions mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Button
              variant="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Play size={18} />
              Play All
            </Button>

            <Button
              variant="secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Shuffle size={18} />
              Shuffle
            </Button>
          </div>
        </div>
      </div>

      {/* Songs */}

      {playlist.songs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 py-20 px-6 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-full bg-purple-600/10 flex items-center justify-center mb-6">
            <Music2 className="w-12 h-12 text-purple-400" />
          </div>

          <h2 className="text-3xl font-bold">No Songs Yet</h2>

          <p className=" text-gray-400 mt-4 text-sm md:text-base">
            Add your favorite songs and start building your perfect vibe.
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">
            Songs ({playlist.songs.length})
          </h2>

          <div className="songs-container space-y-6">
            {playlist.songs.map((song) => (
              <div key={song._id} className="song-card">
                <SongCard
                  song={song}
                  favorites={[]}
                  setFavorites={() => {}}
                  setCurrentSong={setCurrentSong}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  showFavorite={false}
                  showPlaylistButton={false}
                  showRemoveButton={true}
                  onRemove={() => removeSong(song._id)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistDetails;
