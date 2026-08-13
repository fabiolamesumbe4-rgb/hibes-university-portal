import { useState, useMemo } from "react";
import { Download, Save, AlertTriangle } from "lucide-react";

interface Student {
  id: string;
  name: string;
  major: string;
  attendance: number; 
  midterm: number | null; 
  final: number | null;
}

interface Course {
  id: string;
  label: string;
  students: Student[];
}


interface ScoreEdit {
  midterm?: number;
  final?: number;
}

type EditsState = Record<string, ScoreEdit>;

type FieldKey = "midterm" | "final";


const INITIAL_COURSES: Course[] = [
  {
    id: "cs101",
    label: "CS-101: Intro to React",
    students: [
      { id: "s1", name: "Etape Derick", major: "Computer Science", attendance: 96, midterm: 88, final: null },
      { id: "s2", name: "Bless Fon", major: "Computer Science", attendance: 91, midterm: 74, final: null },
      { id: "s3", name: "Grace Epie", major: "Software Engineering", attendance: 99, midterm: 95, final: null },
      { id: "s4", name: "Ivo Mbibi", major: "Computer Science", attendance: 83, midterm: 61, final: null },
      { id: "s5", name: "Ewane Ashu", major: "Information Systems", attendance: 88, midterm: 79, final: null },
    ],
  },
  {
    id: "cs302",
    label: "CS-302: Advanced Database Systems",
    students: [
      { id: "s6", name: "Nadia Ebune", major: "Computer Science", attendance: 94, midterm: 90, final: 92 },
      { id: "s7", name: "Oscar Akame", major: "Software Engineering", attendance: 78, midterm: 68, final: 71 },
      { id: "s8", name: "Precious Mesumbe", major: "Computer Science", attendance: 97, midterm: 84, final: 89 },
      { id: "s9", name: "Roland Ngwesse", major: "Information Systems", attendance: 85, midterm: 77, final: 80 },
    ],
  },
];


const MIDTERM_WEIGHT = 0.4;
const FINAL_WEIGHT = 0.6;

function computeOverallScore(midterm: number | null, final: number | null): number | null {
  if (midterm === null && final === null) return null;
  if (midterm !== null && final === null) return midterm;
  if (midterm === null && final !== null) return final;
  return (midterm as number) * MIDTERM_WEIGHT + (final as number) * FINAL_WEIGHT;
}

function computeLetterGrade(score: number | null): string {
  if (score === null) return "—";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const GRADE_STYLES: Record<string, string> = {
  A: "bg-emerald-50 text-emerald-700 border-emerald-200",
  B: "bg-blue-50 text-blue-700 border-blue-200",
  C: "bg-amber-50 text-amber-700 border-amber-200",
  D: "bg-orange-50 text-orange-700 border-orange-200",
  F: "bg-red-50 text-red-700 border-red-200",
  "—": "bg-[#F4F2F6] text-[#8A7A99] border-[#E5D9F2]",
};


export default function FacultyGradingPortal() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(INITIAL_COURSES[0].id);
  const [edits, setEdits] = useState<EditsState>({});

  
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)!;


  const isDirty = Object.keys(edits).length > 0;

  const rows = useMemo(() => {
    return selectedCourse.students.map((student) => {
      const edit = edits[student.id];
      const midterm = edit?.midterm ?? student.midterm;
      const final = edit?.final ?? student.final;
      const overall = computeOverallScore(midterm, final);
      const letterGrade = computeLetterGrade(overall);
      return { student, midterm, final, letterGrade };
    });
  }, [selectedCourse, edits]);

  function handleScoreChange(studentId: string, field: FieldKey, rawValue: string) {
    const errorKey = `${studentId}-${field}`;

  
    if (rawValue.trim() === "") {
      setEdits((prev) => {
        const next = { ...prev };
        if (next[studentId]) {
          const { [field]: _removed, ...rest } = next[studentId];
          if (Object.keys(rest).length === 0) {
            delete next[studentId];
          } else {
            next[studentId] = rest;
          }
        }
        return next;
      });
      setFieldErrors((prev) => {
        const { [errorKey]: _removed, ...rest } = prev;
        return rest;
      });
      return;
    }

    const value = Number(rawValue);

   
    if (Number.isNaN(value) || value < 0 || value > 100) {
      setFieldErrors((prev) => ({
        ...prev,
        [errorKey]: "Enter a value between 0 and 100.",
      }));
      return;
    }

    
    setFieldErrors((prev) => {
      const { [errorKey]: _removed, ...rest } = prev;
      return rest;
    });
    setEdits((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  }

  function handleSaveChanges() {
    const updatedCourses = courses.map((course) => ({
      ...course,
      students: course.students.map((student) => {
        const edit = edits[student.id];
        if (!edit) return student;
        return {
          ...student,
          midterm: edit.midterm ?? student.midterm,
          final: edit.final ?? student.final,
        };
      }),
    }));

    const payload = Object.entries(edits).map(([studentId, edit]) => {
      const student = courses
        .flatMap((c) => c.students)
        .find((s) => s.id === studentId)!;
      const midterm = edit.midterm ?? student.midterm;
      const final = edit.final ?? student.final;
      return {
        studentId,
        name: student.name,
        midterm,
        final,
        letterGrade: computeLetterGrade(computeOverallScore(midterm, final)),
      };
    });

    alert(`Saved roster changes:\n\n${JSON.stringify(payload, null, 2)}`);

    setCourses(updatedCourses);
    setEdits({});
    setFieldErrors({});
  }

  function handleExportCsv() {
    console.log("Export to CSV clicked for course:", selectedCourse.label);
    alert("Export to CSV — not yet implemented. Check the console.");
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Grading Portal
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Enter scores and letter grades recalculate automatically.
      </p>

      {}
      {isDirty && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          You have unsaved changes. Click "Save Changes" below to apply them.
        </div>
      )}

      {}
      <div className="mt-6">
        <label
          htmlFor="course-select"
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
        >
          Course
        </label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="rounded-md border border-[#E5D9F2] bg-white px-3 py-2 text-sm text-[#3B1160] outline-none focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-md border border-[#E5D9F2] bg-white px-4 py-2 text-sm font-medium text-[#3B1160] hover:bg-[#FAF7FD]"
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={!isDirty}
          className="flex items-center gap-2 rounded-md bg-[#3B1160] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {}
      <div className="mt-4 overflow-hidden rounded-lg border border-[#E5D9F2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5D9F2] bg-[#FAF7FD] text-xs font-medium uppercase tracking-[0.1em] text-[#6B5C7A]">
                <th scope="col" className="px-4 py-3">Student ID</th>
                <th scope="col" className="px-4 py-3">Student Name</th>
                <th scope="col" className="px-4 py-3">Major</th>
                <th scope="col" className="px-4 py-3">Attendance %</th>
                <th scope="col" className="px-4 py-3">Midterm</th>
                <th scope="col" className="px-4 py-3">Final Exam</th>
                <th scope="col" className="px-4 py-3">Letter Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE3F9]">
              {rows.map(({ student, midterm, final, letterGrade }) => {
                const midtermError = fieldErrors[`${student.id}-midterm`];
                const finalError = fieldErrors[`${student.id}-final`];

                return (
                  <tr key={student.id}>
                    <td className="px-4 py-3 text-[#8A7A99]">{student.id}</td>
                    <td className="px-4 py-3 font-medium text-[#3B1160]">
                      {student.name}
                    </td>
                    <td className="px-4 py-3 text-[#6B5C7A]">{student.major}</td>
                    <td className="px-4 py-3 text-[#6B5C7A]">
                      {student.attendance}%
                    </td>

                    {}
                    <td className="px-4 py-3 align-top">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={midterm ?? ""}
                        onChange={(e) =>
                          handleScoreChange(student.id, "midterm", e.target.value)
                        }
                        placeholder="—"
                        aria-invalid={Boolean(midtermError)}
                        className={[
                          "w-20 rounded-md border bg-white px-2 py-1.5 text-sm text-[#3B1160] outline-none",
                          midtermError
                            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                        ].join(" ")}
                      />
                      {midtermError && (
                        <p className="mt-1 text-xs text-red-600">{midtermError}</p>
                      )}
                    </td>

                    {}
                    <td className="px-4 py-3 align-top">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={final ?? ""}
                        onChange={(e) =>
                          handleScoreChange(student.id, "final", e.target.value)
                        }
                        placeholder="—"
                        aria-invalid={Boolean(finalError)}
                        className={[
                          "w-20 rounded-md border bg-white px-2 py-1.5 text-sm text-[#3B1160] outline-none",
                          finalError
                            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                        ].join(" ")}
                      />
                      {finalError && (
                        <p className="mt-1 text-xs text-red-600">{finalError}</p>
                      )}
                    </td>

                    {}
                    <td className="px-4 py-3 align-top">
                      <span
                        className={[
                          "inline-block rounded-full border px-2.5 py-1 text-xs font-medium",
                          GRADE_STYLES[letterGrade],
                        ].join(" ")}
                      >
                        {letterGrade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
