import { motion } from "framer-motion";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  return (
    <div className="w-full">

      {label && (
        <label className="block mb-2 text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}

      <motion.input
        whileFocus={{
          scale: 1.01,
        }}
        transition={{
          duration: 0.08,
        }}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          px-5
          py-3
          text-white
          placeholder:text-zinc-500
          outline-none
          focus:border-purple-500
          focus:ring-2
          focus:ring-purple-500/20
          transition-colors
          ${className}
        `}
      />

    </div>
  );
};

export default Input;