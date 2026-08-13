import { useState } from "react";
import type { FormEvent } from "react";
import { X, CheckCircle2 } from "lucide-react";


type Category =
  | "IT Support"
  | "Course Enrollment Help"
  | "Financial Aid"
  | "Room Booking Error";

type Urgency = "Low" | "Medium" | "High";
type Status = "Open" | "In Progress" | "Resolved";

interface Ticket {
  id: string;
  dateCreated: string;
  subject: string;
  category: Category;
  urgency: Urgency;
  description: string;
  status: Status;
}

interface TicketForm {
  subject: string;
  category: Category | "";
  urgency: Urgency | "";
  description: string;
}

const EMPTY_FORM: TicketForm = {
  subject: "",
  category: "",
  urgency: "",
  description: "",
};

const CATEGORIES: Category[] = [
  "IT Support",
  "Course Enrollment Help",
  "Financial Aid",
  "Room Booking Error",
];

const URGENCY_LEVELS: Urgency[] = ["Low", "Medium", "High"];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TCK-1042",
    dateCreated: "2026-08-05",
    subject: "Cannot access campus Wi-Fi from dorm",
    category: "IT Support",
    urgency: "Medium",
    description: "Wi-Fi drops every few minutes in Molyko Hall, Room 214.",
    status: "In Progress",
  },
  {
    id: "TCK-1038",
    dateCreated: "2026-08-01",
    subject: "Duplicate enrollment in CS-101",
    category: "Course Enrollment Help",
    urgency: "High",
    description: "System shows me enrolled in CS-101 twice, blocking a 3rd course.",
    status: "Resolved",
  },
  {
    id: "TCK-1029",
    dateCreated: "2026-07-22",
    subject: "Scholarship disbursement not reflected",
    category: "Financial Aid",
    urgency: "High",
    description: "Approved scholarship for Fall 2025 isn't showing on my balance.",
    status: "Resolved",
  },
  {
    id: "TCK-1051",
    dateCreated: "2026-08-09",
    subject: "Room booking conflict for study group",
    category: "Room Booking Error",
    urgency: "Low",
    description: "Booked Library Room B for 4 PM but another group is already there.",
    status: "Open",
  },
  {
    id: "TCK-1055",
    dateCreated: "2026-08-11",
    subject: "Portal login shows expired session repeatedly",
    category: "IT Support",
    urgency: "Medium",
    description: "Getting logged out every 5 minutes on the student portal.",
    status: "Open",
  },
];


const TIMELINE_STEPS = [
  "Ticket Created",
  "Assigned to IT Agent",
  "Work In Progress",
  "Issue Resolved",
] as const;

const STATUS_COMPLETED_STEPS: Record<Status, number> = {
  Open: 1,
  "In Progress": 3,
  Resolved: 4,
};

const STATUS_BADGE_STYLES: Record<Status, string> = {
  Open: "bg-amber-50 text-amber-700 border border-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};


export default function SupportTicketing() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const [form, setForm] = useState<TicketForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  function handleFieldChange<K extends keyof TicketForm>(field: K, value: TicketForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFieldBlur(field: keyof TicketForm) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  const formErrors: Partial<Record<keyof TicketForm, string>> = {};
  if (!form.subject.trim()) formErrors.subject = "Subject is required.";
  if (!form.category) formErrors.category = "Select a category.";
  if (!form.urgency) formErrors.urgency = "Select an urgency level.";
  if (!form.description.trim()) formErrors.description = "Description is required.";

  const isFormValid = Object.keys(formErrors).length === 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setTouched({ subject: true, category: true, urgency: true, description: true });
    if (!isFormValid) return;

    const newTicket: Ticket = {
      id: `TCK-${1000 + tickets.length + 60}`,
      dateCreated: new Date().toISOString().slice(0, 10),
      subject: form.subject.trim(),
      category: form.category as Category,
      urgency: form.urgency as Urgency,
      description: form.description.trim(),
      status: "Open", // every new ticket starts life as "Open"
    };
    setTickets((prev) => [newTicket, ...prev]);

    setForm(EMPTY_FORM);
    setTouched({});
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Support Tickets
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Submit a new request or track the status of your existing tickets.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-2 space-y-4 rounded-lg border border-[#E5D9F2] bg-white p-5"
        >
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
            New Ticket
          </h2>

          {}
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]"
            >
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => handleFieldChange("subject", e.target.value)}
              onBlur={() => handleFieldBlur("subject")}
              placeholder="Briefly describe your issue"
              className={[
                "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none placeholder:text-[#C3B4D4]",
                formErrors.subject && touched.subject
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
              ].join(" ")}
            />
            {formErrors.subject && touched.subject && (
              <p className="mt-1 text-xs text-red-600">{formErrors.subject}</p>
            )}
          </div>

          {}
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]"
            >
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => handleFieldChange("category", e.target.value as Category)}
              onBlur={() => handleFieldBlur("category")}
              className={[
                "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                formErrors.category && touched.category
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
              ].join(" ")}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {formErrors.category && touched.category && (
              <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>
            )}
          </div>

          {}
          <div>
            <label
              htmlFor="urgency"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]"
            >
              Urgency
            </label>
            <select
              id="urgency"
              value={form.urgency}
              onChange={(e) => handleFieldChange("urgency", e.target.value as Urgency)}
              onBlur={() => handleFieldBlur("urgency")}
              className={[
                "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                formErrors.urgency && touched.urgency
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
              ].join(" ")}
            >
              <option value="">Select urgency…</option>
              {URGENCY_LEVELS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {formErrors.urgency && touched.urgency && (
              <p className="mt-1 text-xs text-red-600">{formErrors.urgency}</p>
            )}
          </div>

          {}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]"
            >
              Detailed Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={form.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              onBlur={() => handleFieldBlur("description")}
              placeholder="Include as much detail as possible — location, error messages, when it started, etc."
              className={[
                "w-full resize-none rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none placeholder:text-[#C3B4D4]",
                formErrors.description && touched.description
                  ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
              ].join(" ")}
            />
            {formErrors.description && touched.description && (
              <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#3B1160] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46]"
          >
            Submit Ticket
          </button>
        </form>

        {}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
            My Tickets
          </h2>

          <div className="mt-3 space-y-2">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setSelectedTicket(ticket)}
                className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#E5D9F2] bg-white p-4 text-left transition-colors hover:bg-[#FAF7FD]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#A896BB]">
                    <span>{ticket.id}</span>
                    <span>·</span>
                    <span>{ticket.dateCreated}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-[#3B1160]">
                    {ticket.subject}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8A7A99]">{ticket.category}</p>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    STATUS_BADGE_STYLES[ticket.status],
                  ].join(" ")}
                >
                  {ticket.status}
                </span>
              </button>
            ))}

            {tickets.length === 0 && (
              <p className="rounded-md bg-[#FAF7FD] px-4 py-8 text-center text-sm text-[#8A7A99]">
                No tickets yet. Submit one using the form on the left.
              </p>
            )}
          </div>
        </div>
      </div>

      {}
      {selectedTicket && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setSelectedTicket(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#A896BB]">{selectedTicket.id}</p>
                <h2 className="mt-1 font-serif text-lg text-[#3B1160]">
                  {selectedTicket.subject}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close"
                className="text-[#8A7A99] hover:text-[#3B1160]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#6B5C7A]">
              <span
                className={[
                  "rounded-full px-2.5 py-1 font-medium",
                  STATUS_BADGE_STYLES[selectedTicket.status],
                ].join(" ")}
              >
                {selectedTicket.status}
              </span>
              <span>{selectedTicket.category}</span>
              <span>·</span>
              <span>Urgency: {selectedTicket.urgency}</span>
              <span>·</span>
              <span>Filed {selectedTicket.dateCreated}</span>
            </div>

            <p className="mt-4 rounded-md bg-[#FAF7FD] p-3 text-sm text-[#6B5C7A]">
              {selectedTicket.description}
            </p>

            {}
            <div className="mt-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                Status Timeline
              </p>
              <div className="flex items-start">
                {TIMELINE_STEPS.map((step, index) => {
                  const completedCount = STATUS_COMPLETED_STEPS[selectedTicket.status];
                  const isComplete = index < completedCount;
                  const isCurrent = index === completedCount - 1;
                  const isLast = index === TIMELINE_STEPS.length - 1;

                  return (
                    <div key={step} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {}
                        {index > 0 && (
                          <div
                            className={[
                              "h-0.5 flex-1",
                              isComplete || isCurrent ? "bg-[#3B1160]" : "bg-[#E5D9F2]",
                            ].join(" ")}
                          />
                        )}
                        {index === 0 && <div className="flex-1" />}

                        {}
                        <div
                          className={[
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                            isComplete
                              ? "border-[#3B1160] bg-[#3B1160] text-white"
                              : "border-[#E5D9F2] bg-white text-[#C3B4D4]",
                          ].join(" ")}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          )}
                        </div>

                        {}
                        {!isLast && (
                          <div
                            className={[
                              "h-0.5 flex-1",
                              index + 1 < completedCount ? "bg-[#3B1160]" : "bg-[#E5D9F2]",
                            ].join(" ")}
                          />
                        )}
                        {isLast && <div className="flex-1" />}
                      </div>

                      <p
                        className={[
                          "mt-2 max-w-[90px] text-center text-[11px] leading-tight",
                          isComplete ? "font-medium text-[#3B1160]" : "text-[#A896BB]",
                        ].join(" ")}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
