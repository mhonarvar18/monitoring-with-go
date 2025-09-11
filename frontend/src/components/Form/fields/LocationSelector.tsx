import { useState, useEffect, useRef } from "react";
import { useLocationsByType } from "../../../hooks/useLocationsByType";
import { FaChevronDown } from "react-icons/fa6";

interface LocationSelectorProps {
  /** the current selected locationId (could be a CITY or DISTRICT ID) */
  value: number | string;
  /** called with the chosen CITY or DISTRICT ID */
  onChange: (id: number | string) => void;
  hideLabels?: boolean;
  error?: boolean;
  required?: boolean;
  item?: any;
  prefillLocation?: any;
}

// Custom Select Component for Location Selector
interface CustomSelectProps {
  value: number | string | undefined;
  onChange: (e: { target: { value: string } }) => void;
  options: Array<{ id: number | string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  label?: string;
  searchable?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "انتخاب کنید",
  disabled = false,
  error = false,
  required = false,
  label,
  searchable = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownDirection, setDropdownDirection] = useState<"down" | "up">(
    "down"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get selected option
  const selectedOption = options.find((opt) => opt.id === value) || null;

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm(""); // Clear search when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Calculate dropdown direction
  const calculateDropdownDirection = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const dropdownHeight = 250;

    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownDirection("up");
    } else {
      setDropdownDirection("down");
    }
  };

  useEffect(() => {
    if (isOpen) {
      calculateDropdownDirection();
    }
  }, [isOpen]);

  const handleOptionClick = (optionId: number | string) => {
    // Simulate native select onChange event
    onChange({ target: { value: String(optionId) } });
    setIsOpen(false);
    setSearchTerm(""); // Clear search when option selected
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getDisplayLabel = () => {
    return selectedOption ? selectedOption.label : placeholder;
  };

  return (
    <div className="relative" ref={dropdownRef} dir="rtl">
      {/* Trigger */}
      <div
        ref={triggerRef}
        className={`
          relative bg-white border rounded-lg flex items-center justify-between 
          transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md
          px-4 py-3 min-h-[44px]
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-gray-50"
              : "hover:border-gray-400"
          }
          ${
            error
              ? "border-red-500 hover:border-red-600 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-500/20"
              : "border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
          }
          ${
            isOpen && !disabled ? "border-blue-500 ring-2 ring-blue-500/20" : ""
          }
        `}
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`text-sm font-medium truncate ${
              selectedOption ? "text-gray-900" : "text-gray-500"
            }`}
          >
            {getDisplayLabel()}
          </span>
        </div>

        <FaChevronDown
          className={`
            text-sm text-gray-400 transition-transform duration-300 
            ${isOpen ? "rotate-180" : "rotate-0"}
            ${disabled ? "opacity-50" : ""}
          `}
        />
      </div>

      {/* Dropdown Menu */}
      {!disabled && (
        <div
          className={`
            absolute w-full bg-white rounded-lg shadow-xl border border-gray-200 
            overflow-hidden transition-all duration-300 z-50 max-h-64 overflow-y-auto
            ${
              dropdownDirection === "up"
                ? "bottom-full mb-2 origin-bottom"
                : "top-full mt-2 origin-top"
            }
            ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0"
                : `opacity-0 scale-95 pointer-events-none ${
                    dropdownDirection === "up"
                      ? "translate-y-2"
                      : "-translate-y-2"
                  }`
            }
          `}
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو..."
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                         outline-none transition-all duration-200"
                dir="rtl"
              />
            </div>
          )}

          {/* Empty option */}
          <div
            className={`
              flex items-center px-4 py-3 cursor-pointer transition-all duration-200 
              text-gray-500 hover:bg-gray-50 border-b border-gray-100
              ${!selectedOption ? "bg-blue-50 text-blue-600" : ""}
            `}
            onClick={() => handleOptionClick("")}
          >
            <span className="text-sm font-medium">{placeholder}</span>
            {!selectedOption && (
              <div className="mr-auto w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.id}
                className={`
                  flex items-center px-4 py-3 cursor-pointer transition-all duration-200 
                  text-gray-700 hover:bg-blue-50 hover:text-blue-600 
                  border-b border-gray-100 last:border-b-0
                  ${
                    selectedOption?.id === option.id
                      ? "bg-blue-50 text-blue-600"
                      : ""
                  }
                `}
                onClick={() => handleOptionClick(option.id)}
                style={{
                  animationDelay: `${index * 30}ms`,
                }}
              >
                <span className="font-medium flex-1 min-w-0 truncate text-sm">
                  {option.label}
                </span>
                {selectedOption?.id === option.id && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              {searchTerm ? "نتیجه‌ای یافت نشد" : "گزینه‌ای موجود نیست"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function LocationSelector({
  value,
  onChange,
  hideLabels = false,
  error = false,
  required = false,
  item,
  prefillLocation,
}: LocationSelectorProps) {
  const [stateId, setStateId] = useState<number | undefined | string>(
    undefined
  );
  const [cityId, setCityId] = useState<number | undefined | string>(undefined);
  const [districtId, setDistrictId] = useState<number | undefined | string>(
    undefined
  );
  const { data: states = [] } = useLocationsByType("STATE");
  const { data: cities = [] } = useLocationsByType("CITY", stateId, 100, 1);
  const { data: districts = [] } = useLocationsByType(
    "DISTRICT",
    cityId,
    100,
    1
  );

  // Local UI state
  const didPrefill = useRef(false);

  useEffect(() => {
    if (!prefillLocation || didPrefill.current) return;
    didPrefill.current = true;
    if (prefillLocation.type === "DISTRICT") {
      setDistrictId(prefillLocation.id);
      setCityId(prefillLocation.parent.id);
      setStateId(prefillLocation.parent.parent.id);
    } else if (prefillLocation.type === "CITY") {
      setDistrictId(undefined);
      setCityId(prefillLocation.id);
      setStateId(prefillLocation.parent.id);
    } else if (prefillLocation.type === "STATE") {
      setDistrictId(undefined);
      setCityId(undefined);
      setStateId(prefillLocation.id);
    }
  }, [prefillLocation]);

  useEffect(() => {
    if (!states.length) {
      return;
    }
    if (value == null) {
      setStateId(undefined);
      setCityId(undefined);
      setDistrictId(undefined);
      return;
    }

    // DISTRICT
    if (districts.length) {
      const d = districts.find((d) => d.id === value);
      if (d) {
        setDistrictId(d.id);
        setCityId(d.parentId);
        if (cities.length) {
          const parentCity = cities.find((c) => c.id === d.parentId);
          if (parentCity) setStateId(parentCity.parentId);
        }
        return;
      }
    }

    // CITY
    if (cities.length) {
      const c = cities.find((c) => c.id === value);
      if (c) {
        setCityId(c.id);
        setStateId(c.parentId);
        setDistrictId(undefined);
        return;
      }
    }

    // STATE
    const s = states.find((s) => s.id === value);
    if (s) {
      setStateId(s.id);
      setCityId(undefined);
      setDistrictId(undefined);
      return;
    }
  }, [value, states, cities, districts]);

  // Handlers (UNCHANGED LOGIC)
  const handleState = (e: { target: { value: string } }) => {
    const id = e.target.value ? e.target.value : undefined;
    setStateId(id);
    const selectedState = states.find((s) => s.id == id);
    console.log("[LocationSelector] State selected:", id, selectedState?.label);
  };

  const handleCity = (e: { target: { value: string } }) => {
    const id = e.target.value ? e.target.value : undefined;
    setCityId(id);
    const selectedCity = cities.find((c) => c.id == id);
    console.log("[LocationSelector] City selected:", id, selectedCity?.label);
    if (id !== undefined) onChange(id);
  };

  const handleDistrict = (e: { target: { value: string } }) => {
    const id = e.target.value ? e.target.value : undefined;
    setDistrictId(id);
    const selectedDistrict = districts.find((d) => d.id == id);
    console.log(
      "[LocationSelector] District selected:",
      id,
      selectedDistrict?.label
    );
    if (id !== undefined) onChange(id);
  };

  return (
    <div className="">
      <div className={`grid grid-cols-3 gap-4 rounded`}>
        {!hideLabels && (
          <>
            <div className="text-right font-medium text-gray-700">
              استان
              {required && <span className="text-red-600"> *</span>}
            </div>
            <div className="text-right font-medium text-gray-700">
              شهر
              {required && <span className="text-red-600"> *</span>}
            </div>
            <div className="text-right font-medium text-gray-700">منطقه</div>
          </>
        )}

        {/* STATE select */}
        <div>
          <CustomSelect
            value={stateId}
            onChange={handleState}
            options={states}
            placeholder="انتخاب کنید"
            error={error}
            required={required}
            searchable={true} // Enable search for states
          />
          {error && required && !stateId && (
            <p className="text-red-600 text-sm mt-1">این فیلد اجباری است</p>
          )}
        </div>

        {/* CITY select */}
        <div>
          <CustomSelect
            value={cityId}
            onChange={handleCity}
            options={cities}
            placeholder="انتخاب کنید"
            disabled={stateId == null}
            error={error}
            required={required}
            searchable={true} // Enable search for cities
          />
          {error && required && stateId && !cityId && (
            <p className="text-red-600 text-sm mt-1">این فیلد اجباری است</p>
          )}
        </div>

        {/* DISTRICT select */}
        <div>
          <CustomSelect
            value={districtId}
            onChange={handleDistrict}
            options={districts}
            placeholder="—"
            disabled={!cityId}
            error={false}
            required={false}
            searchable={true} // Enable search for districts too
          />
        </div>
      </div>
    </div>
  );
}
