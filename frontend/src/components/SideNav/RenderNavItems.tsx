import { NavLink, useParams, useLocation } from "react-router";
import type { NavItem } from "../../routes/sidebarNav";
import { sidebarNav } from "../../routes/sidebarNav";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { toPersianDigits } from "../../utils/numberConvert";

interface RenderNavItemsProps {
  items?: NavItem[]; // allow passing nested children recursively
}

const hasPermission = (permission?: string) => {
  // Replace with real permission logic
  return true;
};

const RenderNavItems: React.FC<RenderNavItemsProps> = ({
  items = sidebarNav,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { dynamicRoute } = useParams();
  const location = useLocation();

  const toggleSubmenu = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  const buildPath = (path: string) => `/${dynamicRoute}/dashboard${path}`;

  // Auto-open submenu that includes the current path
  useEffect(() => {
    items.forEach((item, index) => {
      if (
        item.children?.some((child) =>
          location.pathname.startsWith(buildPath(child.path))
        )
      ) {
        setOpenIndex(index);
      }
    });
  }, [location.pathname, items]);

  return (
    <ul className="w-full">
      {items
        .filter((item) => !item.hidden && hasPermission(item.permission))
        .map((item, index) => {
          const Icon = item.icon;
          const isOpen = openIndex === index;
          const hasChildren = item.children && item.children.length > 0;

          return (
            <li key={index} className="w-full">
              {hasChildren ? (
                <button
                  onClick={() => toggleSubmenu(index)}
                  className={`w-full flex items-center justify-between pr-[4%] pl-[2%] py-3 rounded text-right transition ${
                    isOpen ? "text-black font-semibold" : "text-black"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 justify-between w-full p-3 rounded-[10px] hover:bg-[#E1F3F4] ${
                      isOpen ? "bg-[#E1F3F4]" : "bg-white"
                    }`}
                  >
                    <span>
                      {isOpen ? (
                        <FiChevronUp size={18} />
                      ) : (
                        <FiChevronDown size={18} />
                      )}
                    </span>
                    <div className="w-full flex justify-end items-center gap-1">
                      <span className="text-sm">{item.label}</span>
                      {Icon && <Icon size={24} color="#828282" />}
                    </div>
                  </div>
                </button>
              ) : (
                <NavLink
                  to={buildPath(item.path)}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between pr-[4%] pl-[2%] py-1 rounded text-right transition outline-none ${
                      isActive ? "text-black font-semibold" : "text-black"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-2 justify-between w-full p-3 rounded-[10px] hover:bg-[#E1F3F4] ${
                        isActive ? "bg-[#E1F3F4]" : "bg-white"
                      }`}
                    >
                      {item.badge ? (
                        <span className="text-xs bg-blue-100 text-blue-600 rounded px-2 py-0.5">
                          {toPersianDigits(item.badge)}
                        </span>
                      ) : (
                        <span className="text-xs opacity-0 px-2 py-0.5"></span>
                      )}
                      <div className="flex justify-center items-center gap-1">
                        <span className="text-sm">{item.label}</span>
                        {Icon && <Icon size={24} color="#828282" />}
                      </div>
                    </div>
                  )}
                </NavLink>
              )}
              {/* Animated submenu */}
              {hasChildren && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-98 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ willChange: "max-height, opacity" }}
                >
                  <div className="mr-6 border-r">
                    <RenderNavItems items={item.children} />
                  </div>
                </div>
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default RenderNavItems;
