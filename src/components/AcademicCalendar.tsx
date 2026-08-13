import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";



type EventType = "Class" | "Exam" | "Holiday" | "Deadline";

interface CalendarEvent {
  id: string;
  date: string;  
  title: string;
  type: EventType;
  time?: string; 
}


const EVENTS: CalendarEvent[] = [
  { id: "e1", date: "2026-08-12", title: "Business Statistics II", type: "Class", time: "9:00 AM" },
  { id: "e2", date: "2026-08-12", title: "Software Engineering Principles", type: "Class", time: "11:00 AM" },
  { id: "e3", date: "2026-08-14", title: "Database Systems Midterm", type: "Exam", time: "1:00 PM" },
  { id: "e4", date: "2026-08-15", title: "Course Registration Deadline", type: "Deadline" },
  { id: "e5", date: "2026-08-18", title: "Founder's Day", type: "Holiday" },
  { id: "e6", date: "2026-08-20", title: "Tuition Balance Due", type: "Deadline" },
  { id: "e7", date: "2026-08-21", title: "Financial Accounting", type: "Class", time: "2:00 PM" },
  { id: "e8", date: "2026-08-26", title: "Marketing Fundamentals Final", type: "Exam", time: "10:00 AM" },
  { id: "e9", date: "2026-09-02", title: "Fall Recess Begins", type: "Holiday" },
  { id: "e10", date: "2026-09-07", title: "Project Milestone 2 Due", type: "Deadline" },
];


const EVENT_TYPE_STYLES: Record<
  EventType,
  { dot: string; badge: string; border: string }
> = {
  Class: {
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    border: "border-l-blue-500",
  },
  Exam: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 border-red-200",
    border: "border-l-red-500",
  },
  Holiday: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-l-emerald-500",
  },
  Deadline: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    border: "border-l-amber-500",
  },
};

const EVENT_TYPES: EventType[] = ["Class", "Exam", "Holiday", "Deadline"];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date): boolean {
  return formatDateKey(a) === formatDateKey(b);
}

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay(); // 0 = Sunday
  const gridStart = new Date(year, month, 1 - startOffset);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}



export default function AcademicCalendar() {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(EVENT_TYPES));

  
  const visibleEvents = useMemo(
    () => EVENTS.filter((e) => activeTypes.has(e.type)),
    [activeTypes]
  );

  
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of visibleEvents) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [visibleEvents]);

  const monthGrid = useMemo(
    () => buildMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth]
  );

  const monthLabel = visibleMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  function goToPreviousMonth() {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function toggleType(type: EventType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  
  const sidePanelEvents = useMemo(() => {
    if (selectedDate) {
      return visibleEvents
        .filter((e) => e.date === formatDateKey(selectedDate))
        .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""));
    }
    const todayKey = formatDateKey(today);
    return visibleEvents
      .filter((e) => e.date >= todayKey)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [selectedDate, visibleEvents, today]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Academic Calendar
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Classes, exams, holidays, and deadlines at a glance.
      </p>

      {}
      <div className="mt-4 flex flex-wrap gap-2">
        {EVENT_TYPES.map((type) => {
          const active = activeTypes.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={[
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? EVENT_TYPE_STYLES[type].badge
                  : "border-[#E5D9F2] bg-white text-[#A896BB]",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  active ? EVENT_TYPE_STYLES[type].dot : "bg-[#C3B4D4]",
                ].join(" ")}
              />
              {type}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {}
        <div className="lg:col-span-2 rounded-lg border border-[#E5D9F2] bg-white p-4">
          {}
          <div className="flex items-center justify-between px-1 pb-3">
            <button
              type="button"
              onClick={goToPreviousMonth}
              aria-label="Previous month"
              className="rounded-md p-1.5 text-[#6B5C7A] hover:bg-[#FAF7FD] hover:text-[#3B1160]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-sm font-medium text-[#3B1160]">{monthLabel}</p>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="rounded-md p-1.5 text-[#6B5C7A] hover:bg-[#FAF7FD] hover:text-[#3B1160]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {}
          <div className="grid grid-cols-7 gap-1 px-1 text-center text-[11px] font-medium uppercase tracking-[0.08em] text-[#A896BB]">
            {WEEKDAY_LABELS.map((day) => (
              <div key={day} className="py-1.5">
                {day}
              </div>
            ))}
          </div>

          {}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day) => {
              const key = formatDateKey(day);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
              const isToday = isSameDay(day, today);
              const isSelected = selectedDate !== null && isSameDay(day, selectedDate);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(isSelected ? null : day)}
                  className={[
                    "flex min-h-[64px] flex-col items-start rounded-md p-1.5 text-left transition-colors",
                    isSelected
                      ? "bg-[#3B1160] text-white"
                      : isToday
                      ? "bg-[#EFE3F9]"
                      : "hover:bg-[#FAF7FD]",
                    !isCurrentMonth && !isSelected ? "opacity-40" : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "text-xs font-medium",
                      isSelected ? "text-white" : "text-[#3B1160]",
                    ].join(" ")}
                  >
                    {day.getDate()}
                  </span>

                  {}
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          isSelected ? "bg-white/70" : EVENT_TYPE_STYLES[event.type].dot,
                        ].join(" ")}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span
                        className={[
                          "text-[9px] leading-none",
                          isSelected ? "text-white/70" : "text-[#A896BB]",
                        ].join(" ")}
                      >
                        +{dayEvents.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
              {selectedDate
                ? selectedDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Upcoming"}
            </h2>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-xs font-medium text-[#8A4FC9] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {sidePanelEvents.map((event) => (
              <div
                key={event.id}
                className={[
                  "rounded-md border-l-4 bg-white p-3",
                  EVENT_TYPE_STYLES[event.type].border,
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={[
                      "inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      EVENT_TYPE_STYLES[event.type].badge,
                    ].join(" ")}
                  >
                    {event.type}
                  </span>
                  {!selectedDate && (
                    <span className="text-[10px] text-[#A896BB]">
                      {parseDateKey(event.date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm font-medium text-[#3B1160]">
                  {event.title}
                </p>
                {event.time && (
                  <p className="mt-0.5 text-xs text-[#8A7A99]">{event.time}</p>
                )}
              </div>
            ))}

            {sidePanelEvents.length === 0 && (
              <p className="rounded-md bg-[#FAF7FD] px-4 py-8 text-center text-sm text-[#8A7A99]">
                {selectedDate
                  ? "No events on this day."
                  : "No upcoming events match the current filter."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
