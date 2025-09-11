import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface SelectionFieldProps {
  name?: string;
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options?: Option[];
  required?: boolean;
  error?: boolean;
}

const SelectionField: React.FC<SelectionFieldProps> = ({
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Get selected option
  const selectedOption = options.find(opt => String(opt.value) === String(value)) || null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate dropdown direction based on available space
  const calculateDropdownDirection = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const dropdownHeight = 250; // Estimated dropdown height

    // If there's not enough space below but enough above, show dropdown upward
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownDirection('up');
    } else {
      setDropdownDirection('down');
    }
  };

  // Recalculate direction when opening
  useEffect(() => {
    if (isOpen) {
      calculateDropdownDirection();
    }
  }, [isOpen]);

  const handleOptionClick = (option: Option) => {
    if (onChange) {
      onChange(option.value as string | number);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange('');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayLabel = () => {
    return selectedOption ? selectedOption.label : 'انتخاب کنید';
  };

  return (
    <div className="flex flex-col gap-2" dir="rtl">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}

      {/* Custom Select */}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger */}
        <div
          ref={triggerRef}
          className={`
            relative bg-white border rounded-lg flex items-center justify-between 
            transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md
            px-4 py-3 min-h-[44px]
            ${error 
              ? 'border-red-500 hover:border-red-600 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500/20' 
              : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20'
            }
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''}
          `}
          onClick={toggleDropdown}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className={`text-sm font-medium truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
              {getDisplayLabel()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedOption && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
                type="button"
              >
                ×
              </button>
            )}
            <FaChevronDown 
              className={`
                text-sm text-gray-400 transition-transform duration-300 
                ${isOpen ? 'rotate-180' : 'rotate-0'}
              `}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute w-full bg-white rounded-lg shadow-xl border border-gray-200 
            overflow-hidden transition-all duration-300 z-50 max-h-64 overflow-y-auto
            ${dropdownDirection === 'up' 
              ? 'bottom-full mb-2 origin-bottom' 
              : 'top-full mt-2 origin-top'
            }
            ${isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : `opacity-0 scale-95 pointer-events-none ${
                  dropdownDirection === 'up' ? 'translate-y-2' : '-translate-y-2'
                }`
            }
          `}
        >
          {/* Empty option */}
          <div
            className={`
              flex items-center px-4 py-3 cursor-pointer transition-all duration-200 
              text-gray-500 hover:bg-gray-50 border-b border-gray-100
              ${!selectedOption ? 'bg-blue-50 text-blue-600' : ''}
            `}
            onClick={() => handleOptionClick({ label: 'انتخاب کنید', value: '' })}
          >
            <span className="text-sm font-medium">انتخاب کنید</span>
            {!selectedOption && (
              <div className="mr-auto w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {/* Options */}
          {options.map((option, index) => (
            <div
              key={String(option.value)}
              className={`
                flex items-center px-4 py-3 cursor-pointer transition-all duration-200 
                text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                border-b border-gray-100 last:border-b-0
                ${selectedOption?.value === option.value ? 'bg-blue-50 text-blue-600' : ''}
              `}
              onClick={() => handleOptionClick(option)}
              style={{
                animationDelay: `${index * 30}ms`
              }}
            >
              <span className="font-medium flex-1 min-w-0 truncate text-sm">
                {option.label}
              </span>
              {selectedOption?.value === option.value && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          ))}

          {options.length === 0 && (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              گزینه‌ای موجود نیست
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-red-500 text-xs">این فیلد الزامی است</span>
      )}
    </div>
  );
};

export default SelectionField;