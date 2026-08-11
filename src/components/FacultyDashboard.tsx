import React from "react";
import { BookOpen, ClipboardCheck } from "lucide-react";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * FACULTY DASHBOARD (mock)
 * ─────────────────────────────────────────────────────────────────────────
 * Placeholder content only — real course/grading data gets wired in later.
 * Rendered inside <AppLayout>, so no sidebar/header logic lives here.
 * ─────────────────────────────────────────────────────────────────────────
 */

// Placeholder data — replace with real fetches later.
const ACTIVE_COURSES = [
  { code: "BUS 301", name: "Business Statistics II", students: 42 },
  { code: "ENG 214", name: "Software Engineering Principles", students: 35 },
  { code: "BUS 110", name: "Introduction to Accounting", students: 58 },
  { code: "ENG 220", name: "Database Systems", students: 29 },
];

const PENDING_GRADES = [
  { course: "BUS 301", item: "Midterm Exam", count: 42 },
  { course: "ENG 214", item: "Project Milestone 2", count: 12 },
  { course: "BUS 110", item: "Quiz 4", count: 6 },
];

export default function FacultyDashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Greeting */}
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Welcome back, Prof. Etame
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Here's an overview of your courses and outstanding work.
      </p>

      {/* Active courses grid */}
      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
          Active Courses
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACTIVE_COURSES.map((course) => (
            <div
              key={course.code}
              className="flex items-start gap-3 rounded-lg border border-[#E5D9F2] bg-white p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFE3F9] text-[#3B1160]">
                <BookOpen className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]">
                  {course.code}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#3B1160]">
                  {course.name}
                </p>
                <p className="mt-1 text-xs text-[#8A7A99]">
                  {course.students} students enrolled — placeholder
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending grades to approve */}
      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
          Pending Grades to Approve
        </h2>
        <div className="mt-3 divide-y divide-[#EFE3F9] rounded-lg border border-[#E5D9F2] bg-white">
          {PENDING_GRADES.map((task) => (
            <div key={`${task.course}-${task.item}`} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="h-4 w-4 text-[#8A7A99]" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium text-[#3B1160]">{task.item}</p>
                  <p className="text-xs text-[#8A7A99]">{task.course}</p>
                </div>
              </div>
              <span className="rounded-full bg-[#EFE3F9] px-2.5 py-1 text-xs font-medium text-[#3B1160]">
                {task.count} pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
