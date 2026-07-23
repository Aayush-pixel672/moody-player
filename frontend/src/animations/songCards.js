import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateSongCards = ({ songsGridRef }) => {
  if (!songsGridRef.current) return;

  gsap.from(songsGridRef.current.children, {
    opacity: 0,
    y: 60,
    scale: 0.95,
    stagger: 0.15,
    duration: 0.8,
    ease: "power3.out",

    scrollTrigger: {
      trigger: songsGridRef.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
};