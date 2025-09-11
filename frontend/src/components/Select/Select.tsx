import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import type { IconType } from 'react-icons';

// Types and Interfaces
interface SelectOption {
  value: string;
  label: string;
  icon?: IconType;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string, option: SelectOption) => void;
  disabled?: boolean;
  className?: string;
  width?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'glass' | 'solid' | 'outline';
  position?: 'left' | 'right';
  showIcons?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  maxHeight?: string;
  dir?: 'ltr' | 'rtl';
}

interface SizeConfig {
  container: string;
  trigger: string;
  text: string;
  icon: string;
  dropdown: string;
}

interface VariantConfig {
  trigger: string;
  dropdown: string;
  option: string;
  optionHover: string;
  optionSelected: string;
}

// Size configurations
const sizeConfigs: Record<string, SizeConfig> = {
  sm: {
    container: 'min-w-32',
    trigger: 'px-3 py-2',
    text: 'text-xs',
    icon: 'text-sm',
    dropdown: 'text-xs'
  },
  md: {
    container: 'min-w-48',
    trigger: 'px-4 py-3',
    text: 'text-sm',
    icon: 'text-base',
    dropdown: 'text-sm'
  },
  lg: {
    container: 'min-w-56',
    trigger: 'px-6 py-4',
    text: 'text-base',
    icon: 'text-lg',
    dropdown: 'text-base'
  }
};

// Variant configurations
const variantConfigs: Record<string, VariantConfig> = {
  glass: {
    trigger: 'bg-white/20 hover:bg-white/30 border border-white/30 hover:border-white/50 text-white backdrop-blur-sm',
    dropdown: 'bg-white/95 backdrop-blur-lg border border-white/50',
    option: 'text-slate-700',
    optionHover: 'hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 hover:text-slate-800',
    optionSelected: 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-slate-800'
  },
  solid: {
    trigger: 'bg-white border border-gray-300 hover:border-gray-400 text-gray-900',
    dropdown: 'bg-white border border-gray-200',
    option: 'text-gray-700',
    optionHover: 'hover:bg-blue-50 hover:text-blue-900',
    optionSelected: 'bg-blue-100 text-blue-900'
  },
  outline: {
    trigger: 'bg-transparent border-2 border-[#09A1A4] hover:border-[#09A1A4] text-[#09A1A4] hover:text-[#09A1A4]',
    dropdown: 'bg-white border-2 border-[#09A1A4]',
    option: 'text-gray-700',
    optionHover: 'hover:bg-[#aee2e3] hover:text-[#09A1A4]',
    optionSelected: 'bg-[#09A1A4] text-white'
  }
};

const Select: React.FC<SelectProps> = ({
  options = [],
  value = '',
  placeholder = 'انتخاب کنید',
  onChange,
  disabled = false,
  className = '',
  width = 'auto',
  size = 'md',
  variant = 'glass',
  position = 'right',
  showIcons = true,
  searchable = false,
  clearable = false,
  maxHeight = 'max-h-64',
  dir = 'rtl'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    options.find(opt => opt.value === value) || null
  );
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get configuration based on props
  const sizeConfig = sizeConfigs[size];
  const variantConfig = variantConfigs[variant];

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Update selected option when value prop changes
  useEffect(() => {
    const newSelected = options.find(opt => opt.value === value) || null;
    setSelectedOption(newSelected);
  }, [value, options]);

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
    
    if (onChange) {
      onChange(option.value, option);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOption(null);
    if (onChange) {
      onChange('', {} as SelectOption);
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getDisplayLabel = () => {
    return selectedOption ? selectedOption.label : placeholder;
  };

  const getDisplayIcon = () => {
    return selectedOption?.icon || null;
  };

  return (
    <div 
      className={`relative ${sizeConfig.container} ${className}`} 
      ref={dropdownRef}
      style={{ width }}
      dir={dir}
    >
      <div
        className={`
          relative rounded-2xl flex items-center justify-between 
          transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl
          ${sizeConfig.trigger} ${variantConfig.trigger}
          ${isOpen ? 'shadow-xl' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showIcons && getDisplayIcon() && (
            <div className={sizeConfig.icon}>
              {React.createElement(getDisplayIcon()!)}
            </div>
          )}
          <span className={`${sizeConfig.text} font-medium truncate`}>
            {getDisplayLabel()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {clearable && selectedOption && (
            <button
              onClick={handleClear}
              className={`${sizeConfig.icon} opacity-70 hover:opacity-100 transition-opacity`}
              type="button"
            >
              ×
            </button>
          )}
          <FaChevronDown 
            className={`
              ${sizeConfig.icon} transition-transform duration-300 
              ${isOpen ? 'rotate-180' : 'rotate-0'}
            `}
          />
        </div>
      </div>
      <div
        className={`
          absolute top-full mt-2 w-full rounded-2xl shadow-2xl overflow-hidden
          transition-all duration-300 origin-top z-50 ${maxHeight} overflow-y-auto
          ${variantConfig.dropdown}
          ${position === 'left' ? 'left-0' : 'right-0'}
          ${isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        {/* Search Input */}
        {searchable && (
          <div className="p-3 border-b border-white/20">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو..."
              className={`
                w-full px-3 py-2 rounded-xl border border-gray-300 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                outline-none transition-all duration-200 ${sizeConfig.text}
              `}
              dir={dir}
            />
          </div>
        )}

        {/* Options */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option, index) => (
            <div
              key={option.value}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer
                transition-all duration-200 border-b border-white/10 last:border-b-0
                ${sizeConfig.dropdown} ${variantConfig.option}
                ${variantConfig.optionHover}
                ${selectedOption?.value === option.value ? variantConfig.optionSelected : ''}
                ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => handleOptionClick(option)}
              style={{
                animationDelay: `${index * 30}ms`
              }}
            >
              {showIcons && option.icon && (
                <div className={sizeConfig.icon}>
                  <option.icon />
                </div>
              )}
              <span className="font-medium flex-1 min-w-0 truncate">
                {option.label}
              </span>
              {selectedOption?.value === option.value && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              )}
            </div>
          ))
        ) : (
          <div className={`px-4 py-3 text-center text-gray-500 ${sizeConfig.text}`}>
            {searchTerm ? 'نتیجه‌ای یافت نشد' : 'گزینه‌ای موجود نیست'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;