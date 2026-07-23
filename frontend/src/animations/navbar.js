import { gsap } from "gsap";
import { fadeDown } from "./utils";

export const animateNavbar = ({ navbarRef }) => {
  gsap.from(navbarRef.current, {
    ...fadeDown,
    duration: 0.8,
  });
};