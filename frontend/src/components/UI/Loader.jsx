import { motion } from "framer-motion";

const Loader = ({
  size = 40,
  color = "#9333EA",
}) => {
  return (
    <div className="flex justify-center items-center">

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
          ease: "linear",
        }}
        style={{
          width: size,
          height: size,
          border: `4px solid rgba(255,255,255,0.15)`,
          borderTop: `4px solid ${color}`,
        }}
        className="rounded-full"
      />

    </div>
  );
};

export default Loader;