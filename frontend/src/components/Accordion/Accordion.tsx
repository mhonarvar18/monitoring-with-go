import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  onToggle?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  isOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  onToggle,
  className = "",
  contentClassName = "",
  isOpen: controlledIsOpen
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (controlledIsOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  return (
    <div className={`${className} ${isOpen ? "bg-gray-200 rounded-lg transition-all": ""}`}>
      <button
        onClick={handleToggle}
        className={`
        w-full 
        flex justify-between items-center 
        outline-none py-4 px-2 
        text-right 
        ${
          isOpen
            ? "rounded-t-[10px]" // only top corners are rounded when open
            : "rounded-[10px]" // all corners are rounded when closed
        }
        transition-all duration-300 ease-in-out
      `}
      >
        <span className="text-base font-semibold">{title}</span>
        {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            // Here we add a border and round the bottom corners
            className={`${contentClassName} overflow-hidden rounded-b-[10px] flex justify-center items-center`}
          >
            <div className="w-full flex justify-center items-center">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
