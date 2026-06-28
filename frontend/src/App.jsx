import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useState } from "react";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";

import UploadSong from "./pages/UploadSong";

import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {

  const [currentSong, setCurrentSong] = useState(null);

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Home
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

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
              <History
                setCurrentSong={setCurrentSong}
              />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/upload"
          element={
            <UploadSong/>
          }
        />

      </Routes>

    </BrowserRouter>

  );
};

export default App;