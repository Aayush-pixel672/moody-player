import { gsap } from "gsap";

export const animateAlbumArt = (albumArtRef, rotationRef, isPlaying) => {
  if (!albumArtRef.current) return;

  if (!rotationRef.current) {
    rotationRef.current = gsap.to(albumArtRef.current, {
      rotation: "+=360",
      duration: 10,
      ease: "none",
      repeat: -1,
      paused: true,
      transformOrigin: "center center",
    });
  }

  if (isPlaying) {
    rotationRef.current.resume();
  } else {
    rotationRef.current.pause();
  }
};