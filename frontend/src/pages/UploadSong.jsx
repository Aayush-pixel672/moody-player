import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  UploadCloud,
  Music2,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  AlertTriangle,
  X,
  Sparkles,
  Disc3,
} from "lucide-react";

import api from "../services/api";
import { toast } from "react-hot-toast";
import MoodDropdown from "../components/UI/MoodDropdown";
// ----------------------------------------------------------------
// Mock "already uploaded" songs — duplicate check isse compare karega.
// Real app mein ye API se aayega (GET /songs).
// ----------------------------------------------------------------

const MAX_IMAGE_SIZE_MB = 5;
const MAX_AUDIO_SIZE_MB = 25;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/mp3",
  "audio/ogg",
];

function normalize(str) {
  return str.trim().toLowerCase();
}

export default function UploadSong() {
  // ---------------- Form state ----------------
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    mood: "Happy", // Default mood
  });
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toasts, setToasts] = useState([]);

  const [recentUploads, setRecentUploads] = useState([]);

  // ---------------- Refs for GSAP ----------------
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const formCardRef = useRef(null);
  const tableRef = useRef(null);
  const progressBarRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // ---------------- Entrance animation ----------------
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        formCardRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" },
      );
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: "power3.out" },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // ---------------- Animate progress bar width ----------------
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${uploadProgress}%`,
        duration: 0.3,
        ease: "power1.out",
      });
    }
  }, [uploadProgress]);

  // ---------------- Toast helpers ----------------
  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ---------------- Input change ----------------
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // ---------------- Image upload + preview ----------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, or WEBP files are allowed",
      }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: null }));
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------------- Audio upload + preview ----------------
  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        audio: "Only MP3, WAV, or OGG files are allowed",
      }));
      return;
    }
    if (file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        audio: `Audio size must be less than ${MAX_AUDIO_SIZE_MB}MB`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, audio: null }));
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }

    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
  };

  // ---------------- Validation ----------------
  const validate = async () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Song title is required";
    }

    if (!formData.artist.trim()) {
      newErrors.artist = "Artist name is required";
    }

    if (!imageFile) {
      newErrors.image = "Cover image is required";
    }

    if (!audioFile) {
      newErrors.audio = "Audio file is required";
    }

    // Duplicate check from actual database
    if (formData.title.trim() && formData.artist.trim()) {
      try {
        const response = await api.get("/songs");

        const songs = response.data || [];

        const isDuplicate = songs.some(
          (song) =>
            normalize(song.title || "") === normalize(formData.title) &&
            normalize(song.artist || "") === normalize(formData.artist),
        );

        if (isDuplicate) {
          newErrors.duplicate =
            "This song has already been uploaded (same title + artist)";
        }
      } catch (error) {
        console.error("Failed to check existing songs:", error);

        newErrors.duplicateCheck =
          "Unable to verify existing songs. Please try again.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  // ---------------- Simulated upload (replace with real API) ----------------

  // ---------------- Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validate())) {
      gsap.fromTo(
        formCardRef.current,
        { x: -8 },
        {
          x: 0,
          duration: 0.4,
          ease: "elastic.out(1, 0.4)",
        },
      );

      addToast("error", "There are errors in the form. Please check them.");

      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();

      data.append("title", formData.title.trim());
      data.append("artist", formData.artist.trim());

      // IMPORTANT:
      // Backend me mood required hai.
      data.append("mood", formData.mood);

      data.append("image", imageFile);
      data.append("audio", audioFile);

      const response = await api.post("/songs", data, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );

            setUploadProgress(progress);
          }
        },
      });

      console.log("Uploaded song:", response.data);

      addToast("success", `"${response.data.title}" uploaded successfully"`);
      setRecentUploads((prev) => [
        {
          id: response.data._id,
          title: response.data.title,
          artist: response.data.artist,
          album: response.data.album || formData.album || "—",
          imagePreview: response.data.image,
          uploadedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
      handleReset(false);

      navigate("/", {
        state: { refreshSongs: true },
      });
    } catch (error) {
      console.error("Song upload error:", error);

      const message =
        error.response?.data?.message || "Upload failed. Please try again";

      addToast("error", message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // ---------------- Reset ----------------
  const handleReset = (showToast = true) => {
    setFormData({
      title: "",
      artist: "",
      album: "",
      mood: "Happy",
    });

    setImageFile(null);
    setAudioFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
    }

    setImagePreview(null);
    setAudioPreview(null);

    setErrors({});
    setUploadProgress(0);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (audioInputRef.current) {
      audioInputRef.current.value = "";
    }

    if (showToast) {
      addToast("success", "Form has been reset");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen text-white px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 0%, rgba(139,92,246,0.18), transparent 45%), radial-gradient(circle at 85% 20%, rgba(236,72,153,0.14), transparent 40%), #08060d",
      }}
    >
      {/* ---------------- Ambient glow blobs ---------------- */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-violet-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute top-40 -right-24 w-72 h-72 rounded-full bg-fuchsia-600/20 blur-[110px]" />

      {/* ---------------- Toast container ---------------- */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2 rounded-xl px-4 py-3 shadow-lg border backdrop-blur-md animate-[fadeIn_0.25s_ease-out] ${
              t.type === "success"
                ? "bg-emerald-950/70 border-emerald-600/50 text-emerald-200"
                : "bg-rose-950/70 border-rose-600/50 text-rose-200"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            ) : (
              <XCircle size={18} className="mt-0.5 shrink-0" />
            )}
            <p className="text-sm flex-1">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="opacity-60 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* ---------------- Hero header ---------------- */}
        <div ref={heroRef} className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            <Disc3 size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-fuchsia-300/80 mb-1">
              <Sparkles size={12} />
              <span>ADMIN STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Upload a{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                New Track
              </span>
            </h1>
          </div>
        </div>

        {/* ---------------- Upload Form Card ---------------- */}
        <form
          ref={formCardRef}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-7 space-y-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]"
        >
          {errors.duplicate && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/40 text-amber-300 text-sm rounded-xl px-3.5 py-2.5">
              <AlertTriangle size={16} className="shrink-0" />
              {errors.duplicate}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
                Song Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                placeholder="e.g. Kesariya"
                disabled={loading}
                className={`w-full rounded-xl bg-black/40 border px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500/60 ${
                  errors.title ? "border-rose-500/70" : "border-white/10"
                }`}
              />
              {errors.title && (
                <p className="text-rose-400 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Artist */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
                Artist
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleTextChange}
                placeholder="e.g. Arijit Singh"
                disabled={loading}
                className={`w-full rounded-xl bg-black/40 border px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500/60 ${
                  errors.artist ? "border-rose-500/70" : "border-white/10"
                }`}
              />
              {errors.artist && (
                <p className="text-rose-400 text-xs mt-1">{errors.artist}</p>
              )}
            </div>
          </div>

          {/* Album (optional) */}
          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
              Album{" "}
              <span className="text-gray-600 normal-case font-normal">
                (optional)
              </span>
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleTextChange}
              placeholder="e.g. Brahmastra"
              disabled={loading}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500/60"
            />
          </div>

          {/* Mood */}

          <div>
            <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
              Mood
            </label>

            <MoodDropdown
              value={formData.mood}
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  mood: value,
                }));

                setErrors((prev) => ({
                  ...prev,
                  mood: null,
                }));
              }}
              includeAll={false}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Image upload */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
                Cover Image
              </label>
              <label
                htmlFor="image-input"
                className={`group flex items-center justify-center min-h-36 rounded-2xl border-2 border-dashed cursor-pointer transition overflow-hidden bg-black/30 ${
                  errors.image
                    ? "border-rose-500/60"
                    : "border-white/15 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/[0.04]"
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-auto max-h-64 object-contain rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 h-36">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <ImageIcon size={18} className="text-fuchsia-300" />
                    </div>

                    <span className="text-xs text-gray-500">
                      JPG / PNG / WEBP · max {MAX_IMAGE_SIZE_MB}MB
                    </span>
                  </div>
                )}
              </label>
              <input
                ref={imageInputRef}
                id="image-input"
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
              {errors.image && (
                <p className="text-rose-400 text-xs mt-1">{errors.image}</p>
              )}
            </div>

            {/* Audio upload */}
            {/* Audio upload */}
            <div>
              <label className="block text-xs font-semibold tracking-wide text-gray-400 mb-1.5 uppercase">
                Audio File
              </label>

              <label
                htmlFor="audio-input"
                className={`group flex flex-col items-center justify-center gap-2 h-36 rounded-2xl border-2 border-dashed cursor-pointer transition px-3 text-center bg-black/30 ${
                  errors.audio
                    ? "border-rose-500/60"
                    : "border-white/15 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/[0.04]"
                }`}
              >
                {audioFile ? (
                  <>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                      <Music2 size={18} className="text-fuchsia-300" />
                    </div>

                    <span className="text-xs text-gray-300 truncate max-w-full">
                      {audioFile.name}
                    </span>

                    {audioPreview && (
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full h-8 accent-fuchsia-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Your browser does not support audio playback.
                      </audio>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center group-hover:scale-110 transition">
                      <Music2 size={18} className="text-fuchsia-300/70" />
                    </div>

                    <span className="text-xs text-gray-500">
                      MP3 / WAV / OGG · max {MAX_AUDIO_SIZE_MB}MB
                    </span>
                  </>
                )}
              </label>

              <input
                ref={audioInputRef}
                id="audio-input"
                type="file"
                accept={ACCEPTED_AUDIO_TYPES.join(",")}
                onChange={handleAudioChange}
                disabled={loading}
                className="hidden"
              />

              {errors.audio && (
                <p className="text-rose-400 text-xs mt-1">{errors.audio}</p>
              )}
            </div>
          </div>

          {/* Upload progress */}
          {loading && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Uploading...</span>
                <span className="text-fuchsia-300 font-medium">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-60 disabled:cursor-not-allowed transition rounded-full py-3 text-sm font-semibold shadow-[0_0_25px_rgba(217,70,239,0.35)]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={16} /> Upload Song
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleReset(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/5 disabled:opacity-60 transition rounded-full px-5 py-3 text-sm font-medium text-gray-300"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </form>

        {/* ---------------- Recently Uploaded Songs (Admin Table) ---------------- */}
        <div ref={tableRef} className="mt-8">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-fuchsia-300/80 mb-2">
            <Sparkles size={12} />
            <span>LIBRARY</span>
          </div>
          <h2 className="text-lg font-bold mb-4">Recently Uploaded</h2>

          {recentUploads.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-10 text-center">
              <Disc3 size={26} className="mx-auto text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">
                No songs uploaded till now
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-hidden">
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b border-white/10">
                    <tr>
                      <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wide">
                        Cover
                      </th>
                      <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wide">
                        Title
                      </th>
                      <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wide">
                        Artist
                      </th>
                      <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wide">
                        Album
                      </th>
                      <th className="text-left font-medium px-5 py-3 text-xs uppercase tracking-wide">
                        Uploaded
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.map((song) => (
                      <tr
                        key={song.id}
                        className="border-t border-white/5 hover:bg-white/[0.03] transition"
                      >
                        <td className="px-5 py-3">
                          {song.imagePreview ? (
                            <img
                              src={song.imagePreview}
                              alt={song.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                              <Music2 size={14} className="text-gray-600" />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3 font-medium text-white">
                          {song.title}
                        </td>
                        <td className="px-5 py-3 text-gray-400">
                          {song.artist}
                        </td>
                        <td className="px-5 py-3 text-gray-400">
                          {song.album}
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {song.uploadedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile stacked cards */}
              <div className="sm:hidden divide-y divide-white/5">
                {recentUploads.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    {song.imagePreview ? (
                      <img
                        src={song.imagePreview}
                        alt={song.title}
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Music2 size={16} className="text-gray-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white truncate">
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {song.artist} · {song.album}
                      </p>
                    </div>
                    <span className="text-gray-500 text-[11px] whitespace-nowrap shrink-0">
                      {song.uploadedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
