import { Activity, Server, Users, ShieldCheck, UserPlus, Settings2 } from "lucide-react";


const SYSTEM_METRICS = [
  { label: "System Uptime", value: "99.98%", icon: Activity },
  { label: "Active Sessions", value: "1,204", icon: Users },
  { label: "Server Load", value: "38%", icon: Server },
  { label: "Security Status", value: "Nominal", icon: ShieldCheck },
];

const QUICK_ACTIONS = [
  { label: "Add User", icon: UserPlus },
  { label: "Manage Roles", icon: Settings2 },
  { label: "View All Users", icon: Users },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-5xl">
      {}
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Welcome back, Admin
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Here's the current state of the portal.
      </p>

      {}
      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
          System Health
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SYSTEM_METRICS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-[#E5D9F2] bg-white p-5">
              <div className="flex items-center gap-2 text-[#8A7A99]">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="text-xs font-medium uppercase tracking-[0.14em]">
                  {label}
                </span>
              </div>
              <p className="mt-3 font-serif text-2xl text-[#3B1160]">{value}</p>
              <p className="mt-1 text-xs text-[#8A7A99]">Placeholder value</p>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
          User Management
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => console.log(`${label} clicked`)}
              className="flex items-center gap-3 rounded-lg border border-[#E5D9F2] bg-white p-5 text-left transition-colors hover:bg-[#FAF7FD]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFE3F9] text-[#3B1160]">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-[#3B1160]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
