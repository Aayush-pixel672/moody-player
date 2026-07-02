import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  onClick,
  hover = true,
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.02,
            }
          : {}
      }
      transition={{
        duration: 0.18,
      }}
      className={`
        rounded-3xl
        border
        border-zinc-800
        bg-zinc-900/90
        backdrop-blur-xl
        shadow-lg
        shadow-black/30
        overflow-hidden
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;