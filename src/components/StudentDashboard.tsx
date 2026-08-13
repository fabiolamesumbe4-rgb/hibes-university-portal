import { GraduationCap, Clock, MapPin } from "lucide-react";
import StudentGradeBook from "./StudentGradeBook";
import CourseRegistration from "./CourseRegistration";

const TODAYS_CLASSES = [
  { course: "Business Statistics II", time: "9:00 AM – 10:30 AM", room: "Hall B, Room 204" },
  { course: "Software Engineering Principles", time: "11:00 AM – 12:30 PM", room: "Engineering Block, Lab 3" },
  { course: "Financial Accounting", time: "2:00 PM – 3:30 PM", room: "Hall A, Room 108" },
];

export default function StudentDashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      {}
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Welcome back, Ekume
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Here's what's on your plate today.
      </p>

      {}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {}
        <div className="rounded-lg border border-[#E5D9F2] bg-white p-5">
          <div className="flex items-center gap-2 text-[#8A7A99]">
            <GraduationCap className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-xs font-medium uppercase tracking-[0.14em]">
              Current GPA
            </span>
          </div>
          <p className="mt-3 font-serif text-3xl text-[#3B1160]">3.72</p>
          <p className="mt-1 text-xs text-[#8A7A99]">Placeholder value — Fall 2026</p>
        </div>

        {}
        <div className="rounded-lg border border-[#E5D9F2] bg-white p-5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A7A99]">
            Credits Completed
          </span>
          <p className="mt-3 font-serif text-3xl text-[#3B1160]">84 / 120</p>
          <p className="mt-1 text-xs text-[#8A7A99]">Placeholder value</p>
        </div>

        {}
        <div className="rounded-lg border border-[#E5D9F2] bg-white p-5">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-[#8A7A99]">
            Academic Standing
          </span>
          <p className="mt-3 font-serif text-3xl text-[#3B1160]">Good</p>
          <p className="mt-1 text-xs text-[#8A7A99]">Placeholder value</p>
        </div>
      </div>

      {}
      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
          Today's Classes
        </h2>
        <div className="mt-3 divide-y divide-[#EFE3F9] rounded-lg border border-[#E5D9F2] bg-white">
          {TODAYS_CLASSES.map((cls) => (
            <div key={cls.course} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-[#3B1160]">{cls.course}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-[#8A7A99]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {cls.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {cls.room}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Grade Book */}
      <div className="mt-8">
        <StudentGradeBook />
        {/* Course Registration */}
      <div className="mt-8">
        <CourseRegistration />
      </div>
    </div>
      </div>
  );
}
    