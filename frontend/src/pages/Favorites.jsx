import { useEffect, useState } from "react"

const Favorites = () => {

  const [favorites, setFavorites] = useState([])

  // LOAD FAVORITES

  useEffect(() => {

    const savedFavorites =
      JSON.parse(
        localStorage.getItem("favorites")
      ) || []

    setFavorites(savedFavorites)

  }, [])

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">

        Favorite Songs ❤️

      </h1>

      {/* NO SONGS */}

      {favorites.length === 0 && (

        <h2 className="text-zinc-400 text-xl">

          No favorite songs yet

        </h2>
      )}

      {/* FAVORITE SONGS */}

      <div className="space-y-5">

        {favorites.map((song) => (

          <div
            key={song.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center gap-5"
          >

            <img
              src={song.image}
              alt=""
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div>

              <h2 className="text-2xl font-semibold">

                {song.title}

              </h2>

              <p className="text-zinc-400">

                {song.artist}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Favorites