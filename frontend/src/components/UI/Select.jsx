import { motion } from "framer-motion";

const Select = ({
  value,
  onChange,
  options = [],
  className = "",
}) => {
  return (
    <motion.select
      whileFocus={{
        scale: 1.01,
      }}
      transition={{
        duration: 0.08,
      }}
      value={value}
      onChange={onChange}
      className={`
        w-full
        rounded-2xl
        bg-zinc-900
        border
        border-zinc-700
        px-5
        py-3
        text-white
        outline-none
        focus:border-purple-500
        focus:ring-2
        focus:ring-purple-500/20
        transition-colors
        ${className}
      `}
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </motion.select>
  );
};

export default Select;