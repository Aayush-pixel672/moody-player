import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp } from "./utils";

gsap.registerPlugin(ScrollTrigger);

export const fadeOnScroll = (target, options = {}) => {
  if (!target?.current) return;

  gsap.from(target.current, {
    ...fadeUp,
    ...options,
    scrollTrigger: {
      trigger: target.current,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
};