import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from "./pages/Home"
import Favorites from "./pages/Favorites"
import History from "./pages/History"

const App = () => {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/history"
          element={<History />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App