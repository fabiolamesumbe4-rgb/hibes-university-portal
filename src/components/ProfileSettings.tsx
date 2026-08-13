import { useState } from "react";
import type { ComponentType } from "react";
import { Eye, EyeOff, User, Lock, SlidersHorizontal } from "lucide-react";


interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface Preferences {
  emailNotifications: boolean;
  smsAlerts: boolean;
  darkMode: boolean;
}

interface UserProfile {
 
  id: string;
  institutionalEmail: string;
  department: string;

  
  phone: string;
  address: string;
  emergencyContact: EmergencyContact;

  
  preferences: Preferences;
}


const INITIAL_USER: UserProfile = {
  id: "STU-2025-0147",
  institutionalEmail: "amara.ngu@hibesbuea.edu",
  department: "Computer Science",
  phone: "+237 6XX XXX 214",
  address: "12 Molyko Avenue, Buea, South West Region",
  emergencyContact: {
    name: "Comfort Ngu",
    relationship: "Mother",
    phone: "+237 6XX XXX 998",
  },
  preferences: {
    emailNotifications: true,
    smsAlerts: false,
    darkMode: false,
  },
};

const TABS = ["Personal Information", "Security Settings", "Preferences"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS: Record<Tab, ComponentType<{ className?: string }>> = {
  "Personal Information": User,
  "Security Settings": Lock,
  Preferences: SlidersHorizontal,
};



export default function ProfileSettings() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState<Tab>("Personal Information");

  
  const [contactInfo, setContactInfo] = useState({
    phone: user.phone,
    address: user.address,
    emergencyContact: user.emergencyContact,
  });

  function handleContactChange(field: "phone" | "address", value: string) {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  }

  function handleEmergencyChange(field: keyof EmergencyContact, value: string) {
    setContactInfo((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  }

  function handleSaveContactInfo() {
    
    setUser((prev) => ({ ...prev, ...contactInfo }));
    console.log("Saved contact info:", contactInfo);
  }

  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  function handlePasswordChange(field: keyof typeof passwordForm, value: string) {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  }

  
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword;
  const canSavePassword =
    passwordForm.currentPassword.length > 0 &&
    passwordForm.newPassword.length > 0 &&
    passwordsMatch;

  
  const showMismatchError =
    passwordForm.confirmPassword.length > 0 && !passwordsMatch;

  function handleSavePassword() {
    if (!canSavePassword) return;
    
    console.log("Password update submitted:", {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  }

 
  const [preferences, setPreferences] = useState<Preferences>(user.preferences);

  function togglePreference(key: keyof Preferences) {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSavePreferences() {
    setUser((prev) => ({ ...prev, preferences }));
    console.log("Saved preferences:", preferences);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-2xl text-[#3B1160] sm:text-3xl">
        Profile Settings
      </h1>
      <p className="mt-1 text-sm text-[#6B5C7A]">
        Manage your personal information, security, and preferences.
      </p>

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        {}
        <nav className="flex shrink-0 gap-1 overflow-x-auto md:w-56 md:flex-col md:overflow-visible">
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  active
                    ? "bg-[#3B1160] text-white"
                    : "text-[#6B5C7A] hover:bg-[#FAF7FD]",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{tab}</span>
              </button>
            );
          })}
        </nav>

        {}
        <div className="flex-1 rounded-lg border border-[#E5D9F2] bg-white p-6">
          {}
          {activeTab === "Personal Information" && (
            <div className="space-y-6">
              {}
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                  University Record
                </h2>
                <p className="mt-0.5 text-xs text-[#A896BB]">
                  Managed by the Registrar — contact the Help Desk to update.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <ReadOnlyField label="Student ID" value={user.id} />
                  <ReadOnlyField label="Institutional Email" value={user.institutionalEmail} />
                  <ReadOnlyField label="Department" value={user.department} />
                </div>
              </div>

              {/* Editable contact info */}
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                  Contact Information
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <EditableField
                    label="Phone Number"
                    value={contactInfo.phone}
                    onChange={(v) => handleContactChange("phone", v)}
                  />
                  <EditableField
                    label="Mailing Address"
                    value={contactInfo.address}
                    onChange={(v) => handleContactChange("address", v)}
                  />
                </div>
              </div>

              {}
              <div>
                <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                  Emergency Contact
                </h2>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <EditableField
                    label="Full Name"
                    value={contactInfo.emergencyContact.name}
                    onChange={(v) => handleEmergencyChange("name", v)}
                  />
                  <EditableField
                    label="Relationship"
                    value={contactInfo.emergencyContact.relationship}
                    onChange={(v) => handleEmergencyChange("relationship", v)}
                  />
                  <EditableField
                    label="Phone Number"
                    value={contactInfo.emergencyContact.phone}
                    onChange={(v) => handleEmergencyChange("phone", v)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveContactInfo}
                className="rounded-md bg-[#3B1160] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46]"
              >
                Save Changes
              </button>
            </div>
          )}

          {}
          {activeTab === "Security Settings" && (
            <div className="max-w-sm space-y-5">
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                Update Password
              </h2>

              <PasswordField
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(v) => handlePasswordChange("currentPassword", v)}
                visible={showPassword.current}
                onToggleVisible={() =>
                  setShowPassword((prev) => ({ ...prev, current: !prev.current }))
                }
              />
              <PasswordField
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(v) => handlePasswordChange("newPassword", v)}
                visible={showPassword.new}
                onToggleVisible={() =>
                  setShowPassword((prev) => ({ ...prev, new: !prev.new }))
                }
              />
              <div>
                <PasswordField
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(v) => handlePasswordChange("confirmPassword", v)}
                  visible={showPassword.confirm}
                  onToggleVisible={() =>
                    setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
                  }
                  hasError={showMismatchError}
                />
                {showMismatchError && (
                  <p className="mt-1.5 text-xs text-red-600">
                    New Password and Confirm New Password don't match.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleSavePassword}
                disabled={!canSavePassword}
                className="rounded-md bg-[#3B1160] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Password
              </button>
            </div>
          )}

          {}
          {activeTab === "Preferences" && (
            <div className="space-y-5">
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
                Notification & Display Preferences
              </h2>

              <ToggleRow
                label="Email Notifications"
                description="Get grade updates and announcements by email."
                checked={preferences.emailNotifications}
                onToggle={() => togglePreference("emailNotifications")}
              />
              <ToggleRow
                label="SMS Alerts"
                description="Get urgent alerts (e.g. exam changes) by text message."
                checked={preferences.smsAlerts}
                onToggle={() => togglePreference("smsAlerts")}
              />
              <ToggleRow
                label="Dark Mode"
                description="Switch the portal to a dark color theme."
                checked={preferences.darkMode}
                onToggle={() => togglePreference("darkMode")}
              />

              <button
                type="button"
                onClick={handleSavePreferences}
                className="rounded-md bg-[#3B1160] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A0C46]"
              >
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]">
        {label}
      </p>
      <p className="mt-1 rounded-md bg-[#F4F2F6] px-3 py-2 text-sm text-[#6B5C7A]">
        {value}
      </p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.1em] text-[#8A7A99]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#E5D9F2] bg-white px-3 py-2 text-sm text-[#3B1160] outline-none focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  hasError,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  hasError?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#6B5C7A]">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full rounded-md border bg-white py-2 pl-3 pr-10 text-sm text-[#3B1160] outline-none",
            hasError
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-[#E5D9F2] focus:border-[#3B1160] focus:ring-2 focus:ring-[#3B1160]/10",
          ].join(" ")}
        />
        <button
          type="button"
          onClick={onToggleVisible}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A896BB] hover:text-[#3B1160]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onToggle,
}: {
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-[#E5D9F2] px-4 py-3">
      <div>
        <p className="text-sm font-medium text-[#3B1160]">{label}</p>
        <p className="mt-0.5 text-xs text-[#8A7A99]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={label}
        className={[
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#3B1160]" : "bg-[#E5D9F2]",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
