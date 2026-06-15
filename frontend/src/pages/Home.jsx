import Navbar from "../components/Navbar"
import SongsSection from "../components/SongsSection"
import MusicPlayer from "../components/MusicPlayer"
import { useState } from "react"
import songsData from "../utils/songsData"
import FacialExpression from "../components/FacialExpression"

const Home = () => {

  const [currentSong, setCurrentSong] = useState(null)

  const [mood, setMood] = useState("Detecting...")

  const [startDetection, setStartDetection] = useState(false)

  return (

    <div className="min-h-screen pb-32 bg-black text-white">

      <Navbar />

      <div className="max-w-7xl mx-auto px-10 py-10">

        {/* HERO SECTION */}

        <div className="grid grid-cols-2 gap-10 items-center">

          {/* LEFT */}

          <div>

            <h1 className="text-6xl font-bold leading-tight">

              Live{" "}

              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mood
              </span>

              Detection

            </h1>

            <p className="text-zinc-400 mt-6 text-lg">

              Let's detect your mood in real-time
              and play music that matches you.

            </p>

            {/* START BUTTON */}

            <button
              onClick={() => setStartDetection(true)}
              className="mt-8 bg-purple-600 hover:bg-purple-700 transition px-8 py-4 rounded-xl text-lg font-semibold"
            >

              Start Mood Detection

            </button>

            {/* CURRENT MOOD */}

            <h2 className="text-2xl mt-6 text-purple-400 font-semibold">

              Current Mood : {mood}

            </h2>

          </div>

          {/* RIGHT */}

          <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">

            <FacialExpression
              setMood={setMood}
              startDetection={startDetection}
            />

          </div>

        </div>

        {/* SONGS SECTION */}

        <SongsSection
          setCurrentSong={setCurrentSong}
          mood={mood}
        />

      </div>

      {/* MUSIC PLAYER */}

      <MusicPlayer
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songsData={songsData}
      />

    </div>
  )
}

export default Home