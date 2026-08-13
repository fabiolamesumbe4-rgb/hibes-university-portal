import { useState, useMemo, Fragment } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";



type LetterGrade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "IP";
type CourseStatus = "Passed" | "In Progress";

interface Assignment {
  name: string;
  percentage: number;
}

interface Course {
  id: string;
  semester: string; 
  code: string; 
  name: string;
  credits: number;
  letterGrade: LetterGrade;
  percentage: number; 
  status: CourseStatus;
  assignments: Assignment[];
}


const COURSES: Course[] = [
  {
    id: "c1",
    semester: "Fall 2025",
    code: "BUS 301",
    name: "Business Statistics II",
    credits: 3,
    letterGrade: "A-",
    percentage: 91,
    status: "Passed",
    assignments: [
      { name: "Midterm", percentage: 88 },
      { name: "Project 1", percentage: 95 },
      { name: "Final Exam", percentage: 91 },
    ],
  },
  {
    id: "c2",
    semester: "Fall 2025",
    code: "ACC 110",
    name: "Introduction to Accounting",
    credits: 4,
    letterGrade: "B+",
    percentage: 87,
    status: "Passed",
    assignments: [
      { name: "Quiz 1", percentage: 84 },
      { name: "Midterm", percentage: 89 },
      { name: "Final Exam", percentage: 88 },
    ],
  },
  {
    id: "c3",
    semester: "Fall 2025",
    code: "ENG 101",
    name: "Academic Writing",
    credits: 3,
    letterGrade: "A",
    percentage: 95,
    status: "Passed",
    assignments: [
      { name: "Essay 1", percentage: 93 },
      { name: "Essay 2", percentage: 96 },
      { name: "Final Portfolio", percentage: 96 },
    ],
  },
  {
    id: "c4",
    semester: "Spring 2026",
    code: "ENG 214",
    name: "Software Engineering Principles",
    credits: 4,
    letterGrade: "IP",
    percentage: 90,
    status: "In Progress",
    assignments: [
      { name: "Project Milestone 1", percentage: 92 },
      { name: "Midterm", percentage: 88 },
    ],
  },
  {
    id: "c5",
    semester: "Spring 2026",
    code: "ENG 220",
    name: "Database Systems",
    credits: 3,
    letterGrade: "IP",
    percentage: 84,
    status: "In Progress",
    assignments: [
      { name: "Quiz 1", percentage: 80 },
      { name: "Project Milestone 1", percentage: 87 },
    ],
  },
  {
    id: "c6",
    semester: "Spring 2026",
    code: "BUS 210",
    name: "Marketing Fundamentals",
    credits: 3,
    letterGrade: "B",
    percentage: 85,
    status: "In Progress",
    assignments: [
      { name: "Case Study 1", percentage: 82 },
      { name: "Midterm", percentage: 88 },
    ],
  },
];


const SEMESTERS = ["All Semesters", ...Array.from(new Set(COURSES.map((c) => c.semester)))];


const GRADE_POINTS: Record<LetterGrade, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  IP: 0, 
};


const STATUS_STYLES: Record<CourseStatus, string> = {
  Passed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
};



export default function StudentGradeBook() {
  const [selectedSemester, setSelectedSemester] = useState<string>("All Semesters");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  
  const visibleCourses = useMemo(() => {
    if (selectedSemester === "All Semesters") return COURSES;
    return COURSES.filter((c) => c.semester === selectedSemester);
  }, [selectedSemester]);

  
  const summary = useMemo(() => {
    const creditsAttempted = visibleCourses.reduce((sum, c) => sum + c.credits, 0);

    
    const completed = visibleCourses.filter((c) => c.status === "Passed");
    const creditsEarned = completed.reduce((sum, c) => sum + c.credits, 0);

    const totalQualityPoints = completed.reduce(
      (sum, c) => sum + GRADE_POINTS[c.letterGrade] * c.credits,
      0
    );
    const gpa = creditsEarned > 0 ? totalQualityPoints / creditsEarned : 0;

    return { gpa, creditsAttempted, creditsEarned };
  }, [visibleCourses]);

  function toggleRow(id: string) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="mx-auto max-w-5xl">
      {}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {}
        <div>
          <label
            htmlFor="semester-filter"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
          >
            Semester
          </label>
          <select
            id="semester-filter"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value);
              setExpandedId(null); 
            }}
            className="rounded-md border border-[#E5D9F2] bg-white px-3 py-2 text-sm text-[#3B1160] outline-none focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10"
          >
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {}
        <div className="flex divide-x divide-[#E5D9F2] rounded-lg border border-[#E5D9F2] bg-white">
          <div className="px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A7A99]">
              Semester GPA
            </p>
            <p className="mt-1 font-serif text-xl text-[#3B1160]">
              {summary.gpa.toFixed(2)}
            </p>
          </div>
          <div className="px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A7A99]">
              Credits Attempted
            </p>
            <p className="mt-1 font-serif text-xl text-[#3B1160]">
              {summary.creditsAttempted}
            </p>
          </div>
          <div className="px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#8A7A99]">
              Credits Earned
            </p>
            <p className="mt-1 font-serif text-xl text-[#3B1160]">
              {summary.creditsEarned}
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="mt-6 overflow-hidden rounded-lg border border-[#E5D9F2] bg-white">
        {}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5D9F2] bg-[#FAF7FD] text-xs font-medium uppercase tracking-[0.1em] text-[#6B5C7A]">
                <th scope="col" className="w-8 px-4 py-3">
                  {}
                  <span className="sr-only">Expand</span>
                </th>
                <th scope="col" className="px-4 py-3">
                  Course Code
                </th>
                <th scope="col" className="px-4 py-3">
                  Course Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Credits
                </th>
                <th scope="col" className="px-4 py-3">
                  Letter Grade
                </th>
                <th scope="col" className="px-4 py-3">
                  Percentage
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE3F9]">
              {visibleCourses.map((course) => {
                const isExpanded = expandedId === course.id;
                return (
                  
                  <Fragment key={course.id}>
                    <tr
                      onClick={() => toggleRow(course.id)}
                      aria-expanded={isExpanded}
                      className="cursor-pointer transition-colors hover:bg-[#FAF7FD]"
                    >
                      <td className="px-4 py-3 text-[#8A7A99]">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#3B1160]">
                        {course.code}
                      </td>
                      <td className="px-4 py-3 text-[#3B1160]">{course.name}</td>
                      <td className="px-4 py-3 text-[#6B5C7A]">{course.credits}</td>
                      <td className="px-4 py-3 text-[#6B5C7A]">{course.letterGrade}</td>
                      <td className="px-4 py-3 text-[#6B5C7A]">{course.percentage}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                            STATUS_STYLES[course.status],
                          ].join(" ")}
                        >
                          {course.status}
                        </span>
                      </td>
                    </tr>

                    {}
                    {isExpanded && (
                      <tr className="bg-[#FAF7FD]">
                        <td />
                        <td colSpan={6} className="px-4 py-4">
                          <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8A7A99]">
                            Assignment Breakdown
                          </p>
                          <ul className="space-y-1.5">
                            {course.assignments.map((a) => (
                              <li
                                key={a.name}
                                className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm"
                              >
                                <span className="text-[#3B1160]">{a.name}</span>
                                <span className="font-medium text-[#6B5C7A]">
                                  {a.percentage}%
                                </span>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}

              {}
              {visibleCourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#8A7A99]">
                    No courses found for this semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}