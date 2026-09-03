const Playlist = require("../models/Playlist.model");

// create Playlist
const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    const exists = await Playlist.findOne({
      userId: req.user.id,
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });

    if (exists) {
      return res.status(400).json({
        message: "Playlist already exists",
      });
    }
    const playlist = await Playlist.create({
      name,
      userId: req.user.id,
      songs: [],
    });
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({
      message: "Failed",
      err: err.message,
    });
  }
};

// Get All Playlists of Logged In User
const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({
      userId: req.user.id,
    }).populate("songs");

    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch playlists",
      error: error.message,
    });
  }
};

// Add Song To Playlist
const addSongToPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    // Prevent duplicate songs
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        message: "Song already exists in playlist",
      });
    }

    playlist.songs.push(songId);

    await playlist.save();

    res.status(200).json({
      message: "Song added successfully",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add song",
      error: error.message,
    });
  }
};

// Remove Song From Playlist
const removeSongFromPlaylist = async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);

    await playlist.save();

    res.status(200).json({
      message: "Song removed successfully",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove song",
      error: error.message,
    });
  }
};

// Get Single Playlist
const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.user.id,
    }).populate("songs");

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch playlist",
      error: error.message,
    });
  }
};

// Update Playlist Name
const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name } = req.body;

    if (!name.trim()) {
      return res.status(400).json({
        message: "Playlist name is required",
      });
    }

    const playlist = await Playlist.findOne({
      _id: playlistId,
      userId: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    const exists = await Playlist.findOne({
      userId: req.user.id,
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      _id: { $ne: playlistId },
    });

    if (exists) {
      return res.status(400).json({
        message: "Playlist already exists",
      });
    }

    playlist.name = name.trim();

    await playlist.save();

    res.status(200).json({
      message: "Playlist updated successfully",
      playlist,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update playlist",
      error: error.message,
    });
  }
};

// Delete Playlist
const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      userId: req.user.id,
    });

    if (!playlist) {
      return res.status(404).json({
        message: "Playlist not found",
      });
    }

    res.status(200).json({
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete playlist",
      error: error.message,
    });
  }
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
