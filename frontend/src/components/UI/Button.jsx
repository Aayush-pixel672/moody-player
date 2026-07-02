import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const baseStyle =
    "rounded-2xl font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20",

    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",

    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20",

    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-5 py-3 text-base",

    lg: "px-7 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.07,
        y: -2,
      }}
      whileTap={{ scale: 0.99 }}
      transition={{
        duration:0.08,
        ease:"easeOut",
        
        
      }}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
