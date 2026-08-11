import React, { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "./AdminDashboard";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * DASHBOARD CONTROLLER
 * ─────────────────────────────────────────────────────────────────────────
 * Reads the current user's role and renders the matching dashboard.
 *
 * Right now `userRole` is local `useState` so you can flip between the
 * three views for testing (see the role switcher below). In a real app,
 * you'd remove that local state and instead pass the role in as a prop,
 * e.g. from an auth/session context:
 *
 *   <DashboardController userRole={session.user.role} />
 *
 * and drop the <select> testing UI entirely.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Keep this in sync with the role values your login page collects
// (see the role selector on UniversityLoginPage.tsx).
export type UserRole = "Student" | "Professor" | "Admin";

interface DashboardControllerProps {
  // Optional: pass a role in from outside (e.g. after real login).
  // Falls back to local state below if omitted, purely for local testing.
  userRole?: UserRole;
}

export default function DashboardController({ userRole }: DashboardControllerProps) {
  // Local state used ONLY so this component works standalone while you're
  // testing. Once real auth is wired up, pass `userRole` in as a prop
  // instead and delete this line + the <select> below.
  const [mockRole, setMockRole] = useState<UserRole>("Student");

  // Prefer the prop if one was passed in; otherwise fall back to the
  // local mock role so you can still test this component in isolation.
  const activeRole = userRole ?? mockRole;

  function renderDashboard() {
    switch (activeRole) {
      case "Student":
        return <StudentDashboard />;
      case "Professor":
        return <FacultyDashboard />;
      case "Admin":
        return <AdminDashboard />;
      default:
        // Defensive fallback — shouldn't be reachable given the UserRole type,
        // but keeps the UI sane if activeRole is ever something unexpected.
        return (
          <p className="text-sm text-[#8A7A99]">
            No dashboard available for this role.
          </p>
        );
    }
  }

  return (
    <div>
      {/* ── TEMPORARY ROLE SWITCHER — for local testing only ──────────
          Delete this block once real auth supplies `userRole` as a prop. */}
      {userRole === undefined && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-dashed border-[#C9A9E0] bg-[#FAF7FD] px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A7A99]">
            Testing as:
          </span>
          <select
            value={mockRole}
            onChange={(e) => setMockRole(e.target.value as UserRole)}
            className="rounded-md border border-[#E5D9F2] bg-white px-3 py-1.5 text-sm text-[#3B1160] outline-none focus:border-[#3B1160]"
          >
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      )}

      {renderDashboard()}
    </div>
  );
}
