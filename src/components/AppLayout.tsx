import React, { useState, ReactNode } from "react";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap as GradesIcon,
  Calendar,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  GraduationCap,
} from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * HIBES PORTAL — APP LAYOUT
 * Higher Institute of Business and Engineering Science, Buea
 * ─────────────────────────────────────────────────────────────────────────
 * Reusable shell: sidebar + top header + scrollable content area.
 *
 * HOW TO USE THIS COMPONENT
 * ──────────────────────────
 * Wrap any page's content in <AppLayout> ... </AppLayout>. Whatever you put
 * between the tags is passed in automatically as the special `children`
 * prop, and gets rendered inside the light-gray, scrollable <main> area:
 *
 *   import AppLayout from "./components/AppLayout";
 *   import StudentDashboard from "./pages/StudentDashboard";
 *
 *   function App() {
 *     return (
 *       <AppLayout>
 *         <StudentDashboard />
 *       </AppLayout>
 *     );
 *   }
 *
 * You never edit AppLayout to change page content — you just swap out what
 * you place inside it. The layout (sidebar, header) stays identical across
 * every page that uses it.
 *
 * Matches the palette used on the login page: deep plum (#3B1160) as the
 * primary brand color, soft lilac (#C9A9E0) as the accent, white/light-gray
 * for surfaces.
 * ─────────────────────────────────────────────────────────────────────────
 */

interface AppLayoutProps {
  children: ReactNode;
}

// Sidebar links live in one array so adding/removing a nav item is a
// single-line change instead of hunting through JSX.
interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Courses", icon: BookOpen },
  { label: "Grades", icon: GradesIcon },
  { label: "Schedule", icon: Calendar },
  { label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: AppLayoutProps) {
  // Controls the mobile slide-out sidebar (hidden by default on small screens)
  const [isOpen, setIsOpen] = useState(false);

  // Tracks which nav item is "active". In a real app this would come from
  // your router (e.g. useLocation()); for now it's local state so the
  // layout works standalone with plain links.
  const [currentTab, setCurrentTab] = useState<string>("Dashboard");

  // Controls the profile dropdown in the top-right of the header
  const [profileOpen, setProfileOpen] = useState(false);

  function handleNavClick(label: string) {
    setCurrentTab(label);
    setIsOpen(false); // close the mobile menu after picking a link
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F4F2F6]">
      {/* ══════════════════════════════════════════════════════════════
          MOBILE OVERLAY — dims the page behind the slide-out sidebar.
          Only rendered (and clickable) while the mobile menu is open.
         ══════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          SIDEBAR
          Desktop: always visible, fixed width, part of the flex row.
          Mobile: fixed + slides in/out via translate-x, toggled by `isOpen`.
         ══════════════════════════════════════════════════════════════ */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#3B1160] text-white transition-transform duration-200 ease-out",
          "lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Sidebar brand row (mirrors header logo, plus a mobile close button) */}
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

        {/* Nav links */}
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {NAV_ITEMS.map(({ label, icon: Icon }) => {
            const active = currentTab === label;
            return (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => handleNavClick(label)}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-[#D9C7ED] hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {/* Active indicator bar */}
                <span
                  className={[
                    "h-5 w-0.5 rounded-full transition-colors",
                    active ? "bg-[#C9A9E0]" : "bg-transparent",
                  ].join(" ")}
                />
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {label}
              </a>
            );
          })}
        </nav>

        {/* Sidebar footer note */}
        <div className="border-t border-white/10 px-5 py-4 text-[11px] text-[#B79ED1]">
          © {new Date().getFullYear()} HIBES Buea
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT COLUMN — header + scrollable content, sits beside the
          sidebar on desktop and takes the full width on mobile.
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* ── TOP HEADER BAR ─────────────────────────────────────────── */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#E5D9F2] bg-white px-4 sm:px-6">
          {/* Left: hamburger (mobile only) + university name/logo */}
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

          {/* Right: user profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-sm text-[#3B1160] hover:bg-[#F4EEFA]"
            >
              {/* Avatar — initials placeholder, swap for an <img> when you have real user data */}
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

            {/* Dropdown panel */}
            {profileOpen && (
              <>
                {/* Click-outside catcher — closes the dropdown on any outside click */}
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
                    onClick={() => {
                      // eslint-disable-next-line no-console
                      console.log("Log out clicked");
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* ── MAIN CONTENT AREA ──────────────────────────────────────
            This is where `children` renders — light gray background,
            scrolls independently of the sidebar/header when content
            is taller than the viewport.
           ─────────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto bg-[#F4F2F6] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
