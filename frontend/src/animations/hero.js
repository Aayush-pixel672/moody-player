import { gsap } from "gsap";
import { fadeUp, fadeRight, scaleIn } from "./utils";

export const animateHero = ({ heroLeftRef, heroRightRef }) => {
  const q = gsap.utils.selector(heroLeftRef);

  const tl = gsap.timeline({
    defaults: {
      ease: "power4.out",
    },
  });

  tl.from(q(".hero-badge"), fadeUp)
    .from(
      q(".hero-title"),
      {
        ...fadeUp,
        y: 40,
        duration: 0.8,
      },
      "-=0.15",
    )
    .from(q(".hero-desc"), fadeUp, "-=0.45")
    .from(q(".hero-btn"), scaleIn, "-=0.25")
    .from(
      q(".hero-mood"),
      {
        ...fadeUp,
        y: 15,
        duration: 0.4,
      },
      "-=0.2",
    );

  gsap.from(heroRightRef.current, {
    ...fadeRight,
    scale: 0.95,
    delay: 0.3,
  });

  return tl;
};
