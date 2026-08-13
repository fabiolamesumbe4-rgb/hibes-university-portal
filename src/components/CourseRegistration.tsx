import { useState, useMemo } from "react";
import { Clock, Users, X, AlertCircle } from "lucide-react";



interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  credits: number;
  schedule: string; 
  seatsTaken: number;
  seatsTotal: number;
}

const MAX_CREDITS = 18;



const COURSES: Course[] = [
  {
    id: "cs101",
    code: "CS 101",
    title: "Introduction to Programming",
    department: "Computer Science",
    credits: 3,
    schedule: "Mon/Wed 9:00–10:30 AM",
    seatsTaken: 26,
    seatsTotal: 30,
  },
  {
    id: "cs220",
    code: "CS 220",
    title: "Data Structures & Algorithms",
    department: "Computer Science",
    credits: 4,
    schedule: "Tue/Thu 11:00 AM–12:30 PM",
    seatsTaken: 18,
    seatsTotal: 28,
  },
  {
    id: "math201",
    code: "MATH 201",
    title: "Calculus II",
    department: "Mathematics",
    credits: 4,
    schedule: "Mon/Wed/Fri 8:00–9:00 AM",
    seatsTaken: 30,
    seatsTotal: 30,
  },
  {
    id: "math315",
    code: "MATH 315",
    title: "Linear Algebra",
    department: "Mathematics",
    credits: 3,
    schedule: "Tue/Thu 1:00–2:30 PM",
    seatsTaken: 12,
    seatsTotal: 25,
  },
  {
    id: "phys150",
    code: "PHYS 150",
    title: "General Physics I",
    department: "Physics",
    credits: 4,
    schedule: "Mon/Wed 2:00–3:30 PM",
    seatsTaken: 20,
    seatsTotal: 32,
  },
  {
    id: "phys150l",
    code: "PHYS 150L",
    title: "General Physics I Lab",
    department: "Physics",
    credits: 1,
    schedule: "Fri 1:00–3:00 PM",
    seatsTaken: 19,
    seatsTotal: 20,
  },
  {
    id: "bus210",
    code: "BUS 210",
    title: "Marketing Fundamentals",
    department: "Business",
    credits: 3,
    schedule: "Tue/Thu 9:00–10:30 AM",
    seatsTaken: 22,
    seatsTotal: 35,
  },
  {
    id: "eng101",
    code: "ENG 101",
    title: "Academic Writing",
    department: "English",
    credits: 3,
    schedule: "Mon/Wed/Fri 10:00–11:00 AM",
    seatsTaken: 27,
    seatsTotal: 30,
  },
];


const DEPARTMENTS = ["All", ...Array.from(new Set(COURSES.map((c) => c.department)))];

export default function CourseRegistration() {
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const visibleCourses = useMemo(() => {
    if (selectedDept === "All") return COURSES;
    return COURSES.filter((c) => c.department === selectedDept);
  }, [selectedDept]);

  const totalCredits = useMemo(
    () => enrolledCourses.reduce((sum, c) => sum + c.credits, 0),
    [enrolledCourses]
  );

  const isEnrolled = (courseId: string) =>
    enrolledCourses.some((c) => c.id === courseId);

  function handleEnroll(course: Course) {
    
    if (isEnrolled(course.id)) {
      setAlertMessage(`You're already enrolled in ${course.code}.`);
      return;
    }

   
    if (totalCredits + course.credits > MAX_CREDITS) {
      setAlertMessage(
        `Adding ${course.code} (${course.credits} credits) would put you at ${
          totalCredits + course.credits
        } credits — over the ${MAX_CREDITS}-credit maximum. Drop a course first.`
      );
      return;
    }

    setAlertMessage(null);
    setEnrolledCourses((prev) => [...prev, course]);
  }

  function handleDrop(courseId: string) {
    setEnrolledCourses((prev) => prev.filter((c) => c.id !== courseId));
    setAlertMessage(null);
    setConfirmed(false);
  }

  function handleConfirm() {
    if (enrolledCourses.length === 0) {
      setAlertMessage("Add at least one course before confirming registration.");
      return;
    }
    
    console.log("Registration confirmed:", enrolledCourses);
    setConfirmed(true);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Course Registration
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Browse available courses and build your semester schedule.
      </p>

      {}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <div className="lg:col-span-2">
          {}
          <div className="flex flex-wrap gap-2">
            {DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDept(dept)}
                  className={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#3B1160] text-white"
                      : "border border-[#E5D9F2] bg-white text-[#6B5C7A] hover:bg-[#FAF7FD]",
                  ].join(" ")}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleCourses.map((course) => {
              const seatsLeft = course.seatsTotal - course.seatsTaken;
              const isFull = seatsLeft <= 0;
              const alreadyEnrolled = isEnrolled(course.id);

              return (
                <div
                  key={course.id}
                  className="flex flex-col rounded-lg border border-[#E5D9F2] bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]">
                        {course.code} · {course.department}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-[#3B1160]">
                        {course.title}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#EFE3F9] px-2.5 py-1 text-xs font-medium text-[#3B1160]">
                      {course.credits} cr
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-[#6B5C7A]">
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {course.schedule}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 shrink-0" />
                      {isFull ? (
                        <span className="font-medium text-red-600">Full</span>
                      ) : (
                        <span>
                          {seatsLeft}/{course.seatsTotal} seats left
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isFull || alreadyEnrolled}
                    onClick={() => handleEnroll(course)}
                    className={[
                      "mt-4 rounded-md py-2 text-sm font-medium transition-colors",
                      alreadyEnrolled
                        ? "cursor-not-allowed bg-[#EFE3F9] text-[#3B1160]"
                        : isFull
                        ? "cursor-not-allowed bg-[#F4F2F6] text-[#A896BB]"
                        : "bg-[#3B1160] text-white hover:bg-[#2A0C46]",
                    ].join(" ")}
                  >
                    {alreadyEnrolled ? "Enrolled" : isFull ? "Full" : "Enroll"}
                  </button>
                </div>
              );
            })}

            {visibleCourses.length === 0 && (
              <p className="col-span-full py-8 text-center text-sm text-[#8A7A99]">
                No courses found in this department.
              </p>
            )}
          </div>
        </div>

        {}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-lg border border-[#E5D9F2] bg-white p-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
              Your Schedule
            </h2>

            {}
            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-2xl text-[#3B1160]">
                  {totalCredits} / {MAX_CREDITS}
                </p>
                <p className="text-xs text-[#8A7A99]">Credits Maximum</p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F4F2F6]">
                <div
                  className={[
                    "h-full rounded-full transition-all",
                    totalCredits > MAX_CREDITS ? "bg-red-500" : "bg-[#3B1160]",
                  ].join(" ")}
                  style={{
                    width: `${Math.min((totalCredits / MAX_CREDITS) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {}
            {alertMessage && (
              <div className="mt-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{alertMessage}</span>
              </div>
            )}

            {}
            {confirmed && !alertMessage && (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
                Registration confirmed! Check your console for the submitted
                course list — this demo doesn't submit anywhere real.
              </div>
            )}

            {}
            <div className="mt-4 space-y-2">
              {enrolledCourses.length === 0 ? (
                <p className="rounded-md bg-[#FAF7FD] px-3 py-4 text-center text-xs text-[#8A7A99]">
                  No courses added yet. Click "Enroll" on a course to add it
                  here.
                </p>
              ) : (
                enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-2 rounded-md border border-[#E5D9F2] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#3B1160]">
                        {course.code}
                      </p>
                      <p className="text-[11px] text-[#8A7A99]">
                        {course.credits} credits
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDrop(course.id)}
                      aria-label={`Drop ${course.code}`}
                      className="shrink-0 rounded-full p-1 text-[#A896BB] hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={enrolledCourses.length === 0}
              className="mt-5 w-full rounded-md bg-[#3B1160] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
