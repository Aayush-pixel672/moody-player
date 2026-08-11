import { createContext, useContext, useState } from "react";

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        setCurrentSong,

        isPlaying,
        setIsPlaying,

        queue,
        setQueue,

        currentIndex,
        setCurrentIndex,

      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  return useContext(MusicContext);
};
