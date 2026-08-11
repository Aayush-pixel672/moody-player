import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Music2, Search, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(useGSAP);
const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

  const [playlistName, setPlaylistName] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const navigate = useNavigate();
  const container = useRef(null);

  const fetchPlaylists = async () => {
    try {
      const response = await api.get("/playlists");

      setPlaylists(response.data);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const totalSongs = useMemo(() => {
    return playlists.reduce(
      (total, playlist) => total + playlist.songs.length,
      0,
    );
  }, [playlists]);

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useGSAP(
    () => {
      if (!playlists.length) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Hero
      tl.fromTo(
        ".hero",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          clearProps: "all",
        },
      )

        // Cover Icon
        .fromTo(
          ".hero-icon",
          {
            scale: 0.7,
            rotate: -12,
            opacity: 0,
          },
          {
            scale: 1,
            rotate: 0,
            opacity: 1,
            duration: 0.6,
            clearProps: "all",
          },
          "-=0.45",
        )

        // Hero Text
        .fromTo(
          ".hero-content",
          {
            x: 40,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            clearProps: "all",
          },
          "-=0.4",
        )

        // Search Bar
        .fromTo(
          ".search-section",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            clearProps: "all",
          },
          "-=0.2",
        );

      // Playlist Cards
      const cards = gsap.utils.toArray(".playlist-card");

      if (cards.length) {
        tl.fromTo(
          cards,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.45,
            clearProps: "all",
          },
          "-=0.15",
        );
      }

      // Floating Icon
      gsap.to(".hero-icon", {
        y: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    {
      scope: container,
      dependencies: [playlists],
    },
  );

  const createPlaylist = async () => {
    if (!playlistName.trim()) return;

    try {
      const response = await api.post("/playlists", {
        name: playlistName,
      });

      setPlaylists([...playlists, response.data]);

      setPlaylistName("");

      toast.success("Playlist Created");
    } catch (error) {
      console.error(error);

      toast.error("Failed to create playlist");
    }
  };

  const openDeleteModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setShowDeleteModal(true);
  };

  const deletePlaylist = async () => {
    try {
      await api.delete(`/playlists/${selectedPlaylist._id}`);

      setPlaylists((prev) =>
        prev.filter((playlist) => playlist._id !== selectedPlaylist._id),
      );

      toast.success("Playlist deleted");

      setShowDeleteModal(false);
      setSelectedPlaylist(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete playlist");
    }
  };

  return (
    <div ref={container} className="max-w-6xl mx-auto py-10 px-5">
      <div className="hero relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-6 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.45)] mb-10">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="hero-icon h-36 w-36 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <Music2 className="w-16 h-16 text-white" />
          </div>

          <div className="hero-content flex-1 text-center md:text-left">
            <p className="uppercase tracking-[4px] text-sm text-zinc-400">
              Library
            </p>

            <h1 className="mt-2 text-4xl md:text-5xl font-bold">
              My Playlists
            </h1>

            <p className="mt-4 text-zinc-400 max-w-xl">
              Organize your favorite songs into beautiful collections and enjoy
              them anytime.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
              <div>
                <p className="text-3xl font-bold">{playlists.length}</p>
                <p className="text-sm text-zinc-500">Playlists</p>
              </div>

              <div>
                <p className="text-3xl font-bold">{totalSongs}</p>
                <p className="text-sm text-zinc-500">Songs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-section mb-10 flex flex-col lg:flex-row gap-4">
        {/* Search */}

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search playlists..."
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 py-3 pl-12 pr-4 outline-none transition focus:border-purple-500"
          />
        </div>

        {/* Create */}

        <div className="flex gap-3">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist name"
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 outline-none focus:border-purple-500"
          />

          <Button onClick={createPlaylist} className="flex items-center gap-2">
            <Plus size={18} />
            Create
          </Button>
        </div>
      </div>

      {filteredPlaylists.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 py-20 px-6 flex flex-col items-center justify-center text-center">
          <div className="h-24 w-24 rounded-full bg-purple-600/10 flex items-center justify-center mb-6">
            <Music2 className="w-12 h-12 text-purple-400" />
          </div>

          <h2 className="text-3xl font-bold">No Playlists Yet</h2>

          <p className="mt-4 max-w-md text-zinc-400">
            Create your first playlist and organize your favorite songs into one
            place.
          </p>
          <Button
            onClick={() => {
              document
                .querySelector('input[placeholder="Playlist name"]')
                ?.focus();
            }}
            className="mt-6 flex items-center gap-2"
          >
            <Plus size={18} />
            Create Your First Playlist
          </Button>
        </div>
      ) : (
        <div className="playlist-grid grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlaylists.map((playlist) => (
            <Card
              key={playlist._id}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="playlist-card group cursor-pointer p-6 transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_15px_35px_rgba(168,85,247,0.25)]"
            >
              <div className="flex items-start justify-between">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Music2 className="w-8 h-8 text-white" />
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(playlist);
                  }}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold group-hover:text-purple-300 transition-colors">
                  {playlist.name}
                </h2>

                <p className="mt-2 text-zinc-400">
                  {playlist.songs.length}{" "}
                  {playlist.songs.length === 1 ? "Song" : "Songs"}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="rounded-full border border-purple-500/20 bg-purple-600/15 px-3 py-1 text-xs font-medium text-purple-300">
                  Playlist
                </span>

                <span className="text-sm text-zinc-500 group-hover:text-purple-400 transition-colors">
                  Open
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedPlaylist(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Trash2 size={30} className="text-red-400" />
                </div>
              </div>

              <h2 className="mt-5 text-center text-2xl font-bold">
                Delete Playlist
              </h2>

              <p className="mt-3 text-center text-zinc-400">
                Are you sure you want to permanently delete
              </p>

              <p className="mt-2 text-center font-semibold text-purple-300">
                "{selectedPlaylist?.name}"
              </p>

              <p className="mt-2 text-center text-sm text-zinc-500">
                This action cannot be undone.
              </p>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPlaylist(null);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={deletePlaylist}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Playlists;
