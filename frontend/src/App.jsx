import { BrowserRouter, Routes, Route } from "react-router-dom";



import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MusicPlayer from "./components/MusicPlayer";
import UploadSong from "./pages/UploadSong";

import ProtectedRoutes from "./components/ProtectedRoutes";

import AdminRoute from "./components/AdminRoute";

import AdminDashboard from "./pages/AdminDashboard";

import { Toaster } from "react-hot-toast";

import Playlists from "./pages/Playlists";

import PlaylistDetails from "./pages/PlaylistDetails";

const App = () => {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/favorites"
          element={
            <ProtectedRoutes>
              <Favorites />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoutes>
              <History />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/playlists"
          element={
            <ProtectedRoutes>
              <Playlists />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/playlists/:id"
          element={
            <ProtectedRoutes>
              <PlaylistDetails />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/upload"
          element={
            <AdminRoute>
              <UploadSong />
            </AdminRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
      <MusicPlayer />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: {
            background: "#18181B",
            color: "#fff",
            border: "1px solid #3F3F46",
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;
