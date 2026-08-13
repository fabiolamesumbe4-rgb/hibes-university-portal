import { useState } from "react";
import type { ReactNode, ComponentType } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import UniversityLogo from '../assets/university-logo.png';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap as GradesIcon,
  Calendar,
  LifeBuoy,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  GraduationCap,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { useAuth } from "./AuthContext";



interface AppLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Courses", path: "/courses", icon: BookOpen },
  { label: "Grades", path: "/grades", icon: GradesIcon },
  { label: "Schedule", path: "/schedule", icon: Calendar },
  { label: "Support", path: "/support", icon: LifeBuoy },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    setProfileOpen(false);
    navigate("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F2F6]">
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}



<div className="flex items-center gap-3">
  {/* The Logo Image */}
  <img 
    src={UniversityLogo} 
    alt="University-Logo" 
    className="h-9 w-auto object-contain" 
  />
  {}
  <span className="text-xl font-bold text-gray-800 hidden sm:inline">

  </span>
</div>

      {/* ══════════════════════════════════════════════════════════════
          SIDEBAR
         ══════════════════════════════════════════════════════════════ */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#3B1160] text-white transition-transform duration-200 ease-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
              <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="font-serif text-sm tracking-wide">HIBES Buea</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="text-white/70 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={label}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[#D9C7ED] hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      "h-5 w-0.5 rounded-full transition-colors",
                      isActive ? "bg-[#C9A9E0]" : "bg-transparent",
                    ].join(" ")}
                  />
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-[11px] text-[#B79ED1]">
          © {new Date().getFullYear()} HIBES Buea
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT COLUMN — header + scrollable content
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5D9F2] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="text-[#3B1160] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-[#3B1160] text-white sm:flex">
                <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="font-serif text-[15px] tracking-wide text-[#3B1160]">
                Higher Institute of Business &amp; Engineering Science, Buea
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <NotificationCenter />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm text-[#3B1160] hover:bg-[#F4EEFA]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EFE3F9] text-xs font-semibold text-[#3B1160]">
                  AN
                </span>
                <span className="hidden font-medium sm:inline">Amara Ngu</span>
                <ChevronDown
                  className={[
                    "h-4 w-4 text-[#8A7A99] transition-transform",
                    profileOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    role="menu"
                    className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-md border border-[#E5D9F2] bg-white shadow-lg"
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-[#3B1160]">Amara Ngu</p>
                      <p className="text-xs text-[#8A7A99]">amara.ngu@hibesbuea.edu</p>
                    </div>
                    <div className="border-t border-[#EFE3F9]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F4F2F6] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
