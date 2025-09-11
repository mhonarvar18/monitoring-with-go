import { useState } from "react";
import { FiChevronDown, FiMapPin, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface LocationFilterAccordionProps {
  title: string;
  children: React.ReactNode;
  onToggle?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  isOpen?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
  selectedLocation?: string | null;
  selectedProvince?: string | null;
  selectedCity?: string | null;
  isLoading?: boolean;
}

const LocationFilterAccordion: React.FC<LocationFilterAccordionProps> = ({
  title,
  children,
  onToggle,
  className = "",
  contentClassName = "",
  isOpen: controlledIsOpen,
  icon,
  subtitle,
  selectedLocation,
  selectedProvince,
  selectedCity,
  isLoading = false
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const handleToggle = () => {
    const next = !isOpen;
    if (controlledIsOpen === undefined) setInternalOpen(next);
    onToggle?.(next);
  };

  // Create location display text
  const getLocationText = () => {
    if (selectedCity && selectedProvince) {
      return `${selectedCity} - ${selectedProvince}`;
    } else if (selectedProvince) {
      return selectedProvince;
    }
    return null;
  };

  const locationText = getLocationText();
  const hasSelection = selectedLocation || selectedProvince;

  return (
    <div className={`${className} bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md border-[#09A1A4]/20' : 'hover:shadow-md'}`}>
      <button
        onClick={handleToggle}
        className={`
          w-full 
          flex justify-between items-center 
          outline-none p-4
          text-right 
          transition-all duration-300 ease-in-out
          hover:bg-gray-50/50
          ${isOpen ? 'bg-gradient-to-r from-[#09A1A4]/5 to-transparent' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 bg-[#09A1A4]/10 rounded-lg relative">
              {icon}
              {isLoading && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          )}
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-gray-800">{title}</span>
              {hasSelection && (
                <div className="flex items-center gap-1 bg-[#09A1A4] text-white px-2 py-1 rounded-full text-xs">
                  <FiCheck size={12} />
                  <span>انتخاب شده</span>
                </div>
              )}
            </div>
            {subtitle && !locationText && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
            {locationText && (
              <p className="text-sm text-[#09A1A4] font-medium mt-1">{locationText}</p>
            )}
          </div>
        </div>
        
        <div className={`p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-[#09A1A4]/10 text-[#09A1A4] rotate-180' : 'bg-gray-100 text-gray-600'}`}>
          <FiChevronDown size={20} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${contentClassName} overflow-hidden border-t border-gray-100`}
          >
            <div className="p-4 bg-gradient-to-b from-gray-50/30 to-white">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationFilterAccordion;