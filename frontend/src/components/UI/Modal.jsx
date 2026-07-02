import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            initial={{
              scale: 0.9,
              opacity: 0,
              y: 30,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
              y: 30,
            }}
            transition={{
              duration: 0.2,
            }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl w-[450px] p-8 shadow-2xl"
          >

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-3xl font-bold text-white">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                ×
              </button>

            </div>

            {children}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
};

export default Modal;