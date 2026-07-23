import { gsap } from "gsap";
import { stagger } from "./utils";

export const animateStatsCards = ({ statsRef }) => {
  gsap.from(statsRef.current.children, {
    ...stagger,
    delay: 0.8,
  });
};