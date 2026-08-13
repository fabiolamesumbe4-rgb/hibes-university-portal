import { useState, useRef, useEffect } from "react";
import type { RefObject } from "react";
import { Bell, Check } from "lucide-react";



type Category = "Academic" | "Finance" | "System Update";
type Priority = "High" | "Medium" | "Low";

interface Notification {
  id: string;
  category: Category;
  priority: Priority;
  message: string;
  timestamp: string;
  read: boolean;
}



const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    category: "Academic",
    priority: "High",
    message: "Your Fall 2025 grades have been posted by the Registrar.",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "n2",
    category: "Finance",
    priority: "High",
    message: "Tuition balance of $420 is due by August 20.",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    category: "System Update",
    priority: "Low",
    message: "Scheduled maintenance this Saturday, 1 AM – 4 AM.",
    timestamp: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    category: "Academic",
    priority: "Medium",
    message: "New assignment posted in CS-302: Advanced Database Systems.",
    timestamp: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    category: "System Update",
    priority: "Low",
    message: "Your profile photo was updated successfully.",
    timestamp: "2 days ago",
    read: true,
  },
];


const CATEGORY_STYLES: Record<Category, string> = {
  Academic: "bg-blue-50 text-blue-700",
  Finance: "bg-amber-50 text-amber-700",
  "System Update": "bg-[#EFE3F9] text-[#3B1160]",
};


const PRIORITY_BORDER_STYLES: Record<Priority, string> = {
  High: "border-l-4 border-l-red-300",
  Medium: "border-l-4 border-l-amber-300",
  Low: "border-l-4 border-l-gray-300",
};


function useClickOutside<T extends HTMLElement>(
  onOutsideClick: () => void
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onOutsideClick]);

  return ref;
}



export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS
  );
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  
  const latestFour = notifications.slice(0, 4);

  function markAsRead(id: string) {
    
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div ref={containerRef} className="relative">
      {}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        className="relative rounded-full p-2 text-[#6B5C7A] hover:bg-[#F4EEFA] hover:text-[#3B1160]"
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-80 overflow-hidden rounded-lg border border-[#E5D9F2] bg-white shadow-lg"
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-[#EFE3F9] px-4 py-3">
            <p className="text-sm font-medium text-[#3B1160]">Notifications</p>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs font-medium text-[#8A4FC9] hover:underline disabled:cursor-not-allowed disabled:text-[#C3B4D4] disabled:no-underline"
            >
              Mark All as Read
            </button>
          </div>

          {}
          <div className="divide-y divide-[#EFE3F9]">
            {latestFour.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={[
                  "flex w-full items-start gap-2 px-4 py-3 text-left transition-colors",
                  PRIORITY_BORDER_STYLES[notification.priority],
                  
                  notification.read ? "bg-[#FAF7FD]/60" : "bg-white hover:bg-[#FAF7FD]",
                ].join(" ")}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={[
                        "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                        CATEGORY_STYLES[notification.category],
                      ].join(" ")}
                    >
                      {notification.category}
                    </span>
                    <span className="shrink-0 text-[10px] text-[#A896BB]">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p
                    className={[
                      "mt-1.5 text-xs leading-relaxed",
                      notification.read ? "text-[#A896BB]" : "text-[#3B1160]",
                    ].join(" ")}
                  >
                    {notification.message}
                  </p>
                </div>

                {}
                {notification.read ? (
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#3B1160]" />
                )}
              </button>
            ))}

            {latestFour.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-[#8A7A99]">
                No notifications yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
