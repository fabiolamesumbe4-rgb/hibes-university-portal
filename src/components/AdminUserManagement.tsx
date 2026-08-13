import { useState, useMemo } from "react";
import { Search, Plus, X, Pencil } from "lucide-react";




type Role = "Student" | "Faculty" | "Admin";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: string;
  dateCreated: string; 
  suspended: boolean;
}

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  role: Role | "";
  department: string;
}

const EMPTY_FORM: NewUserForm = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  department: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



const INITIAL_USERS: User[] = [
  {
    id: "u1001",
    firstName: "Amara",
    lastName: "Ngu",
    email: "amara.ngu@hibesbuea.edu",
    role: "Student",
    department: "Computer Science",
    dateCreated: "2025-09-02",
    suspended: false,
  },
  {
    id: "u1002",
    firstName: "Derrick",
    lastName: "Fon",
    email: "derrick.fon@hibesbuea.edu",
    role: "Student",
    department: "Business Administration",
    dateCreated: "2025-09-04",
    suspended: false,
  },
  {
    id: "u1003",
    firstName: "Grace",
    lastName: "Etame",
    email: "grace.etame@hibesbuea.edu",
    role: "Faculty",
    department: "Computer Science",
    dateCreated: "2024-01-15",
    suspended: false,
  },
  {
    id: "u1004",
    firstName: "Oscar",
    lastName: "Beri",
    email: "oscar.beri@hibesbuea.edu",
    role: "Faculty",
    department: "Mathematics",
    dateCreated: "2023-08-21",
    suspended: true,
  },
  {
    id: "u1005",
    firstName: "Precious",
    lastName: "Fru",
    email: "precious.fru@hibesbuea.edu",
    role: "Student",
    department: "Software Engineering",
    dateCreated: "2026-01-10",
    suspended: false,
  },
  {
    id: "u1006",
    firstName: "Roland",
    lastName: "Che",
    email: "roland.che@hibesbuea.edu",
    role: "Admin",
    department: "Registrar's Office",
    dateCreated: "2022-06-01",
    suspended: false,
  },
  {
    id: "u1007",
    firstName: "Nadia",
    lastName: "Ebune",
    email: "nadia.ebune@hibesbuea.edu",
    role: "Student",
    department: "Accounting",
    dateCreated: "2025-09-01",
    suspended: true,
  },
];

const ROLE_FILTERS = ["All Users", "Students", "Faculty", "Admins"] as const;
type RoleFilter = (typeof ROLE_FILTERS)[number];


const ROLE_FILTER_MAP: Record<RoleFilter, Role | null> = {
  "All Users": null,
  Students: "Student",
  Faculty: "Faculty",
  Admins: "Admin",
};


const ROLE_BADGE_STYLES: Record<Role, string> = {
  Student: "bg-blue-50 text-blue-700 border border-blue-200",
  Faculty: "bg-purple-50 text-[#3B1160] border border-[#C9A9E0]",
  Admin: "bg-amber-50 text-amber-700 border border-amber-200",
};

const DEPARTMENTS = [
  "Computer Science",
  "Software Engineering",
  "Mathematics",
  "Business Administration",
  "Accounting",
  "Registrar's Office",
];



export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All Users");

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<NewUserForm>(EMPTY_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  
  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const roleToMatch = ROLE_FILTER_MAP[roleFilter];

    return users.filter((user) => {
      const matchesRole = roleToMatch === null || user.role === roleToMatch;
      if (!matchesRole) return false;

      if (query === "") return true;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(query) || user.email.toLowerCase().includes(query);
    });
  }, [users, searchQuery, roleFilter]);

  
  function toggleSuspend(userId: string) {
    
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, suspended: !u.suspended } : u))
    );
  }

  
  const formErrors = useMemo(() => {
    const errors: Partial<Record<keyof NewUserForm, string>> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      errors.email = "Institutional email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!form.role) errors.role = "Select a role.";
    if (!form.department) errors.department = "Select a department.";
    return errors;
  }, [form]);

  const isFormValid = Object.keys(formErrors).length === 0;

  function handleFieldChange<K extends keyof NewUserForm>(field: K, value: NewUserForm[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFieldBlur(field: keyof NewUserForm) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function closeModal() {
    setIsModalOpen(false);
    setForm(EMPTY_FORM);
    setTouched({});
  }

  function handleSubmitUser() {
    
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      department: true,
    });

    if (!isFormValid) return;

    const newUser: User = {
      id: `u${1000 + users.length + 1}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role as Role,
      department: form.department,
      dateCreated: new Date().toISOString().slice(0, 10),
      suspended: false,
    };

    
    setUsers((prev) => [...prev, newUser]);
    closeModal();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-[#6B5C7A]">
            Search, filter, and manage every account on the portal.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#3B1160] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46]"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A896BB]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-md border border-[#E5D9F2] bg-white py-2 pl-10 pr-3 text-sm text-[#3B1160] outline-none placeholder:text-[#C3B4D4] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className="rounded-md border border-[#E5D9F2] bg-white px-3 py-2 text-sm text-[#3B1160] outline-none focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="mt-4 overflow-hidden rounded-lg border border-[#E5D9F2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#E5D9F2] bg-[#FAF7FD] text-xs font-medium uppercase tracking-[0.1em] text-[#6B5C7A]">
                <th scope="col" className="px-4 py-3">User ID</th>
                <th scope="col" className="px-4 py-3">Full Name</th>
                <th scope="col" className="px-4 py-3">Email Address</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Date Created</th>
                <th scope="col" className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE3F9]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={user.suspended ? "bg-red-50/40" : undefined}>
                  <td className="px-4 py-3 text-[#8A7A99]">{user.id}</td>
                  <td className="px-4 py-3 font-medium text-[#3B1160]">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3 text-[#6B5C7A]">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                        ROLE_BADGE_STYLES[user.role],
                      ].join(" ")}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B5C7A]">{user.dateCreated}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Suspend Account toggle */}
                      <button
                        type="button"
                        onClick={() => toggleSuspend(user.id)}
                        aria-pressed={user.suspended}
                        aria-label={user.suspended ? "Reactivate account" : "Suspend account"}
                        className={[
                          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
                          user.suspended ? "bg-red-400" : "bg-[#E5D9F2]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            user.suspended ? "translate-x-4" : "translate-x-0.5",
                          ].join(" ")}
                        />
                      </button>
                      <span className="text-xs text-[#8A7A99]">
                        {user.suspended ? "Suspended" : "Active"}
                      </span>

                      {/* Edit placeholder */}
                      <button
                        type="button"
                        onClick={() => console.log("Edit clicked for", user.id)}
                        aria-label={`Edit ${user.firstName} ${user.lastName}`}
                        className="ml-1 rounded-md p-1.5 text-[#8A7A99] hover:bg-[#FAF7FD] hover:text-[#3B1160]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#8A7A99]">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={closeModal}
            aria-hidden="true"
          />

          {}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-heading"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#E5D9F2] px-6 py-4">
              <h2 id="add-user-heading" className="font-serif text-lg text-[#3B1160]">
                Add New User
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-[#8A7A99] hover:text-[#3B1160]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={(e) => handleFieldChange("firstName", e.target.value)}
                  onBlur={() => handleFieldBlur("firstName")}
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                    formErrors.firstName && touched.firstName
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                  ].join(" ")}
                />
                {formErrors.firstName && touched.firstName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.firstName}</p>
                )}
              </div>

              {}
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={(e) => handleFieldChange("lastName", e.target.value)}
                  onBlur={() => handleFieldBlur("lastName")}
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                    formErrors.lastName && touched.lastName
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                  ].join(" ")}
                />
                {formErrors.lastName && touched.lastName && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.lastName}</p>
                )}
              </div>

              {}
              <div>
                <label
                  htmlFor="newUserEmail"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  Institutional Email
                </label>
                <input
                  id="newUserEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  placeholder="name@hibesbuea.edu"
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none placeholder:text-[#C3B4D4]",
                    formErrors.email && touched.email
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                  ].join(" ")}
                />
                {formErrors.email && touched.email && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>
                )}
              </div>

              {}
              <div>
                <label
                  htmlFor="newUserRole"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  Account Role
                </label>
                <select
                  id="newUserRole"
                  value={form.role}
                  onChange={(e) => handleFieldChange("role", e.target.value as Role | "")}
                  onBlur={() => handleFieldBlur("role")}
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                    formErrors.role && touched.role
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                  ].join(" ")}
                >
                  <option value="">Select a role…</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                </select>
                {formErrors.role && touched.role && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.role}</p>
                )}
              </div>

              {}
              <div>
                <label
                  htmlFor="newUserDept"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  Department
                </label>
                <select
                  id="newUserDept"
                  value={form.department}
                  onChange={(e) => handleFieldChange("department", e.target.value)}
                  onBlur={() => handleFieldBlur("department")}
                  className={[
                    "w-full rounded-md border bg-white px-3 py-2 text-sm text-[#3B1160] outline-none",
                    formErrors.department && touched.department
                      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
                  ].join(" ")}
                >
                  <option value="">Select a department…</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {formErrors.department && touched.department && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.department}</p>
                )}
              </div>
            </div>

            <div className="border-t border-[#E5D9F2] px-6 py-4">
              <button
                type="button"
                onClick={handleSubmitUser}
                disabled={!isFormValid}
                className="w-full rounded-md bg-[#3B1160] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit User
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
