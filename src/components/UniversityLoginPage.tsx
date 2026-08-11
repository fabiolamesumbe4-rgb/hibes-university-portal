import React, { useState } from "react";
import type {FormEvent, ChangeEvent } from "react";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ShieldCheck } from "lucide-react";


const ROLES = ["Student", "Professor", "Admin"] as const;
type Role = (typeof ROLES)[number];

interface FormState {
  email: string;
  password: string;
  role: Role;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// Very small, dependency-free email check. Good enough for client-side UX;
// the server should always re-validate.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function UniversityLoginPage() {
  // ── Form state ──────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    role: "Student",
  });

  
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────
  function validate(values: FormState): FormErrors {
    const next: FormErrors = {};

    if (!values.email.trim()) {
      next.email = "Institutional email is required.";
    } else if (!EMAIL_REGEX.test(values.email.trim())) {
      next.email = "Enter a valid email address (e.g. name@hibesbuea.edu).";
    }

    if (!values.password) {
      next.password = "Password is required.";
    } else if (values.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    return next;
  }

  // ── Handlers ────────────────────────────────────────────────────────
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    // Live re-validate only fields that have already been touched, so
    // errors clear/update as the user fixes them instead of feeling static.
    if (touched[name]) {
      setErrors(validate(nextForm));
    }
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  }

  function handleRoleSelect(role: Role) {
    setForm((prev) => ({ ...prev, role }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(nextErrors).length > 0) {
      setSubmitSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    // Mock async submit — replace with your real auth call
    // (fetch / axios / your API client) at this point.
    window.setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log("Login submitted:", {
        email: form.email.trim(),
        password: form.password, // NOTE: never actually log passwords in production
        role: form.role,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 700);
  }

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* ══════════════════════════════════════════════════════════════
          LEFT — LOGIN FORM
         ══════════════════════════════════════════════════════════════ */}
      <div className="flex w-full lg:w-[46%] flex-col justify-center px-6 py-12 sm:px-12 md:px-20 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Mark */}
          <div className="mb-10 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8A4FC9]/40 bg-[#3B1160] text-white">
              <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-[15px] tracking-wide text-[#3B1160]">
                HIBES Buea
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#8A7A99]">
                Campus Portal
              </p>
            </div>
          </div>

          <h1 className="font-serif text-[26px] leading-tight text-[#3B1160] sm:text-[30px]">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-[#6B5C7A]">
            Higher Institute of Business and Engineering Science, Buea —
            use the credentials issued by the Office of the Registrar.
          </p>

          {/* Success banner */}
          {submitSuccess && (
            <div
              role="status"
              className="mt-6 flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Credentials verified locally. Check your console — this demo
                does not perform a real sign-in.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            {/* Role selector — segmented control */}
            <div>
              <span className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                Sign in as
              </span>
              <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-[#E5D9F2] bg-[#FAF7FD] p-1">
                {ROLES.map((role) => {
                  const active = form.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      aria-pressed={active}
                      className={[
                        "rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-[#3B1160] text-white shadow-sm"
                          : "text-[#6B5C7A] hover:bg-[#EFE3F9]",
                      ].join(" ")}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
              >
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A896BB]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane.doe@hibesbuea.edu"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={[
                    "w-full rounded-md border bg-white py-2.5 pl-10 pr-3 text-sm text-[#3B1160] outline-none transition-colors placeholder:text-[#C3B4D4]",
                    "focus:ring-2 focus:ring-offset-0",
                    errors.email && touched.email
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-[#3B1160]/10",
                  ].join(" ")}
                />
              </div>
              {errors.email && touched.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]"
                >
                  Password
                </label>
                <a
                  href="#forgot-password"
                  className="text-xs font-medium text-[#8A4FC9] hover:text-[#3B1160] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A896BB]" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={[
                    "w-full rounded-md border bg-white py-2.5 pl-10 pr-10 text-sm text-[#3B1160] outline-none transition-colors placeholder:text-[#C3B4D4]",
                    "focus:ring-2 focus:ring-offset-0",
                    errors.password && touched.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-[#3B1160]/10",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A896BB] hover:text-[#3B1160]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && touched.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-[#3B1160] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Verifying…" : "Sign in"}
            </button>
          </form>

          {/* Help desk link */}
          <p className="mt-8 text-center text-xs text-[#8A7A99]">
            Trouble signing in?{" "}
            <a
              href="#help-desk"
              className="font-medium text-[#8A4FC9] hover:text-[#3B1160] hover:underline"
            >
              Contact the IT Help Desk
            </a>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT — BRANDING PANE (hidden on mobile / small tablets)
         ══════════════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex lg:w-[54%] overflow-hidden bg-[#3B1160]">
        {/* Faint blueprint-style grid, evoking a campus map */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A9E0 1px, transparent 1px), linear-gradient(90deg, #C9A9E0 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Radial glow behind the seal */}
        <div
          className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,224,0.45) 0%, rgba(59,17,96,0) 70%)",
          }}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-14 xl:p-20">
          {/* Top: institution wordmark */}
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40">
              <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="font-serif text-lg tracking-wide">
              Higher Institute of Business and Engineering Science, Buea
            </span>
          </div>

          {/* Middle: seal / signature element */}
          <div className="flex flex-col items-start">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              fill="none"
              className="mb-8 text-[#C9A9E0]"
            >
              <circle cx="64" cy="64" r="62" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <circle cx="64" cy="64" r="50" stroke="currentColor" strokeWidth="1" opacity="0.7" />
              <text
                x="64"
                y="60"
                textAnchor="middle"
                fontFamily="serif"
                fontSize="26"
                fill="#FFFFFF"
              >
                HIBES
              </text>
              <text
                x="64"
                y="78"
                textAnchor="middle"
                fontFamily="serif"
                fontSize="8"
                letterSpacing="2"
                fill="#C9A9E0"
              >
                BUEA
              </text>
            </svg>

            <h2 className="max-w-md font-serif text-3xl leading-snug text-white xl:text-4xl">
              One portal for every classroom, department, and desk.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#DCC9EE]">
              Students, faculty, and administrators sign in here to reach
              coursework, grading tools, and campus records — all under a
              single, audited login.
            </p>
          </div>

          {/* Bottom: quiet status line */}
          <div className="flex items-center gap-2 text-xs text-[#C3AEDC]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Portal systems operational
          </div>
        </div>
      </div>
    </div>
  );
}
