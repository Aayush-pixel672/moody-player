const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {createPlaylist , getUserPlaylists,addSongToPlaylist,removeSongFromPlaylist,deletePlaylist,getPlaylistById,updatePlaylist} = require("../controllers/Playlist.controller");

router.post("/",authMiddleware,createPlaylist);

router.get("/",authMiddleware,getUserPlaylists);

router.get("/:playlistId",authMiddleware,getPlaylistById)

router.post("/add-song",authMiddleware,addSongToPlaylist)

router.delete(
  "/:playlistId/songs/:songId",
  authMiddleware,
  removeSongFromPlaylist
);

router.patch("/:playlistId", authMiddleware, updatePlaylist);

router.delete("/:playlistId",authMiddleware,deletePlaylist)


module.exports = router;



