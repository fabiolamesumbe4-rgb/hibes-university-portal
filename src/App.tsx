import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./components/AuthContext";
import UniversityLoginPage from "./components/UniversityLoginPage";
import AppLayout from "./components/AppLayout";
import DashboardController from "./components/DashboardController";
import type { UserRole } from "./components/AuthContext";
import StudentGradeBook from "./components/StudentGradeBook";
import FacultyGradingPortal from "./components/FacultyGradingPortal";
import CourseRegistration from "./components/CourseRegistration";
import AdminUserManagement from "./components/AdminUserManagement";
import ProfileSettings from "./components/ProfileSettings";
import DocumentDownloader from "./components/DocumentDownloader";
import SupportTicketing from "./components/SupportTicketing";
import AcademicCalendar from "./components/AcademicCalendar";


function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { userRole } = useAuth();
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}


function ProtectedLayout() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function GradesRoute() {
  const { userRole } = useAuth();
  if (userRole === "Professor") {
    return <FacultyGradingPortal />;
  }
  return <StudentGradeBook />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<UniversityLoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardController />} />

          <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
            <Route path="/courses" element={<CourseRegistration />} />
          </Route>

          <Route
            element={<ProtectedRoute allowedRoles={["Student", "Professor"]} />}
          >
            <Route path="/grades" element={<GradesRoute />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-panel" element={<AdminUserManagement />} />
          </Route>

          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/documents" element={<DocumentDownloader />} />
          <Route path="/support" element={<SupportTicketing />} />
          <Route path="/schedule" element={<AcademicCalendar />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
