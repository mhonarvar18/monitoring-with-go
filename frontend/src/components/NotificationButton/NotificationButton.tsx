import { useState, useRef, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import userAvatar from '../../assets/images/user.avif'

const fakeNotificationsInitial = [
  {
    id: 1,
    text: "شما یک پیام جدید دارید",
    time: "۲ دقیقه پیش",
    read: false,
    avatarUrl: userAvatar,
    avatarInitials: "م",
    icon: "📨",
  },
  {
    id: 2,
    text: "شما یک پیام جدید دارید",
    time: "۲ دقیقه پیش",
    read: false,
    avatarUrl: userAvatar,
    avatarInitials: "م",
    icon: "📨",
  },
  {
    id: 3,
    text: "شما یک پیام جدید دارید",
    time: "۲ دقیقه پیش",
    read: false,
    avatarUrl: userAvatar,
    avatarInitials: "م",
    icon: "📨",
  },
  {
    id: 4,
    text: "شما یک پیام جدید دارید",
    time: "۲ دقیقه پیش",
    read: false,
    avatarUrl: userAvatar,
    avatarInitials: "م",
    icon: "📨",
  },
];

const convertToFarsiNumbers = (input: string | number) =>
  String(input).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

const NotificationButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(fakeNotificationsInitial);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setOpen((prev) => !prev);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notification as read on click
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={menuRef} dir="rtl">
      {/* Notification Icon Button */}
      <button
        className="relative"
        onClick={toggleMenu}
        aria-label="نمایش اعلان‌ها"
      >
        <IoIosNotifications size={24} />
        {/* Show red dot if any unread */}
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Dropdown Menu anchored directly under the icon */}
      {open && (
        <div
          className="absolute top-full -right-[18vw] mt-2 w-96 bg-white shadow-xl rounded-xl z-50 animate-dropdown border border-gray-200"
          style={{ fontFamily: "iransans" }}
        >
          <div className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer transition-all duration-150"
              >
                <div className="flex items-center gap-2">
                  {/* Unread blue dot */}
                  {!n.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>
                  )}

                  {/* Avatar / Icon */}
                  {n.avatarUrl ? (
                    <img
                      src={n.avatarUrl}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : n.avatarInitials ? (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-700">
                      {n.avatarInitials}
                    </div>
                  ) : (
                    <span className="text-xl">{n.icon}</span>
                  )}

                  {/* Notification text */}
                  <span className="text-xs text-gray-700 leading-5">
                    {n.text}
                  </span>
                </div>

                {/* Time on left (end) */}
                <span className="text-[10px] text-gray-400 whitespace-nowrap">
                  {convertToFarsiNumbers(n.time)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            onClick={markAllAsRead}
            className="border-t px-4 py-3 text-center text-sm text-blue-600 hover:bg-gray-50 transition cursor-pointer"
          >
            مشاهده تمام فعالیت‌ها
          </div>
        </div>
      )}

      {/* Tailwind animation & scrollbar styles */}
      <style>{`
        .animate-dropdown {
          animation: scaleIn 0.2s ease-out forwards;
          transform-origin: top right;
        }
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default NotificationButton;
