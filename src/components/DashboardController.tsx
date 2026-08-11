import { useState } from "react";
import StudentDashboard from "./StudentDashboard";
import FacultyDashboard from "./FacultyDashboard";
import AdminDashboard from "./AdminDashboard";



export type UserRole = "Student" | "Professor" | "Admin";

interface DashboardControllerProps {
 
  userRole?: UserRole;
}

export default function DashboardController({ userRole }: DashboardControllerProps) {
  
  const [mockRole, setMockRole] = useState<UserRole>("Student");

  
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
         
        return (
          <p className="text-sm text-[#8A7A99]">
            No dashboard available for this role.
          </p>
        );
    }
  }

  return (
    <div>
        {}
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
