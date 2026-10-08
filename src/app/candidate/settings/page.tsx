"use client";

import { useState } from "react";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { 
  Settings2, UserCircle, SlidersHorizontal, Bell, 
  Shield, CheckCircle2, Lock, LogOut, Trash2
} from "lucide-react";

type InterviewFocus = "General Interview" | "Technical Interview" | "Behavioral Interview" | "HR Interview";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type NumQuestions = "5 Questions" | "10 Questions" | "15 Questions";

function Toggle({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-600 focus:ring-offset-2 ${
        checked ? "bg-accent-600" : "bg-neutral-200"
      }`}
      aria-label={label}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? "translate-x-5" : "translate-x-0"
      }`} />
    </button>
  );
}

export default function CandidateSettingsPage() {
  // Interview Preferences State
  const [focus, setFocus] = useState<InterviewFocus>("General Interview");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [questions, setQuestions] = useState<NumQuestions>("10 Questions");

  // Notifications State
  const [notifInterviewReminders, setNotifInterviewReminders] = useState(true);
  const [notifInterviewResults, setNotifInterviewResults] = useState(true);
  const [notifProfileReminders, setNotifProfileReminders] = useState(true);
  const [notifPlatformUpdates, setNotifPlatformUpdates] = useState(false);

  // Privacy & Preferences State
  const [privacyProfileVis, setPrivacyProfileVis] = useState(true);
  const [privacyRecruiterAccess, setPrivacyRecruiterAccess] = useState(true);
  const [privacyAiData, setPrivacyAiData] = useState(false);

  // Success Message State
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleSavePreferences = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdatePassword = () => {
    setPasswordSuccess(true);
    setTimeout(() => {
      setPasswordSuccess(false);
      setIsPasswordModalOpen(false);
    }, 2000);
  };

  const handleDeleteAccount = () => {
    setDeleteMessage("Account deletion will be available when backend account management is connected.");
  };

  const selectClassName = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 appearance-none";

  return (
    <CandidateLayout>
      <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* PAGE HEADER */}
        <section>
          <div className="mb-7">
            <Badge variant="primary" className="mb-4">
              <Settings2 size={14} className="mr-1.5" />
              SETTINGS
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-navy-900 md:text-4xl">
              Settings
            </h1>

            <p className="mt-3 max-w-2xl text-base text-neutral-500 md:text-lg">
              Manage your account, interview preferences, notifications, and privacy settings.
            </p>
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <Card padding="lg">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <UserCircle size={22} className="text-accent-500" />
                Account Information
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Manage your basic account information.
              </p>
            </div>
            <Link href="/candidate/profile">
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-xl border border-neutral-100">
            <div>
              <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Full Name</span>
              <span className="text-base font-medium text-navy-900">Alex Chen</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Email</span>
              <span className="text-base font-medium text-navy-900">alex.c@example.com</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Phone</span>
              <span className="text-base font-medium text-navy-900">+91 XXXXX XXXXX</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Account Type</span>
              <span className="text-base font-medium text-navy-900">Candidate</span>
            </div>
          </div>
        </Card>

        {/* INTERVIEW PREFERENCES */}
        <Card padding="lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <SlidersHorizontal size={22} className="text-accent-500" />
              Mock Interview Preferences
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Choose your default preferences for AI mock interview practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Default Interview Focus</label>
              <div className="relative">
                <select 
                  className={selectClassName}
                  value={focus}
                  onChange={(e) => setFocus(e.target.value as InterviewFocus)}
                >
                  <option value="General Interview">General Interview</option>
                  <option value="Technical Interview">Technical Interview</option>
                  <option value="Behavioral Interview">Behavioral Interview</option>
                  <option value="HR Interview">HR Interview</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Default Difficulty</label>
              <div className="relative">
                <select 
                  className={selectClassName}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-2">Default Number of Questions</label>
              <div className="relative">
                <select 
                  className={selectClassName}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value as NumQuestions)}
                >
                  <option value="5 Questions">5 Questions</option>
                  <option value="10 Questions">10 Questions</option>
                  <option value="15 Questions">15 Questions</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* NOTIFICATIONS */}
          <Card padding="lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <Bell size={22} className="text-accent-500" />
                Notifications
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Choose which notifications you want to receive.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Interview Reminders</h3>
                  <p className="text-xs text-neutral-500 mt-1">Get reminders about upcoming company interviews.</p>
                </div>
                <Toggle checked={notifInterviewReminders} onChange={setNotifInterviewReminders} label="Interview Reminders" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Interview Results</h3>
                  <p className="text-xs text-neutral-500 mt-1">Get notified when your interview results are available.</p>
                </div>
                <Toggle checked={notifInterviewResults} onChange={setNotifInterviewResults} label="Interview Results" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Profile Reminders</h3>
                  <p className="text-xs text-neutral-500 mt-1">Receive reminders when your profile needs attention.</p>
                </div>
                <Toggle checked={notifProfileReminders} onChange={setNotifProfileReminders} label="Profile Reminders" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Platform Updates</h3>
                  <p className="text-xs text-neutral-500 mt-1">Receive important HireAI updates and announcements.</p>
                </div>
                <Toggle checked={notifPlatformUpdates} onChange={setNotifPlatformUpdates} label="Platform Updates" />
              </div>
            </div>
          </Card>

          {/* PRIVACY & PREFERENCES */}
          <Card padding="lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                <Shield size={22} className="text-accent-500" />
                Privacy & Preferences
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Control how your profile and interview data are used.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Profile visibility</h3>
                  <p className="text-xs text-neutral-500 mt-1">Allow your profile to be visible to recruiters when applicable.</p>
                </div>
                <Toggle checked={privacyProfileVis} onChange={setPrivacyProfileVis} label="Profile visibility" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">Recruiter access</h3>
                  <p className="text-xs text-neutral-500 mt-1">Allow recruiters to view your candidate profile and relevant information.</p>
                </div>
                <Toggle checked={privacyRecruiterAccess} onChange={setPrivacyRecruiterAccess} label="Recruiter access" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">AI improvement data</h3>
                  <p className="text-xs text-neutral-500 mt-1">Allow anonymized interview data to be used to improve HireAI.</p>
                </div>
                <Toggle checked={privacyAiData} onChange={setPrivacyAiData} label="AI improvement data" />
              </div>
            </div>
          </Card>
        </div>

        {/* SAVE PREFERENCES */}
        <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-6">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-success-600 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={16} />
              Settings saved successfully.
            </span>
          )}
          <Button size="lg" onClick={handleSavePreferences}>
            Save Changes
          </Button>
        </div>

        {/* ACCOUNT ACTIONS */}
        <Card padding="lg" className="border-error-200 bg-error-50/10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-navy-900">Account Actions</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
              <Lock size={16} className="mr-2" />
              Change Password
            </Button>
            
            <Link href="/candidate">
              <Button variant="outline">
                <LogOut size={16} className="mr-2" />
                Log Out
              </Button>
            </Link>

            <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-auto">
              <Button variant="danger" onClick={() => { setIsDeleteModalOpen(true); setDeleteMessage(""); }}>
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => { setIsPasswordModalOpen(false); setPasswordSuccess(false); }}
        title="Change Password"
        size="md"
      >
        <div className="mt-4 space-y-4">
          {passwordSuccess ? (
            <div className="rounded-lg bg-success-50 p-4 text-center">
              <CheckCircle2 size={24} className="mx-auto text-success-600 mb-2" />
              <p className="text-sm font-medium text-success-800">Password updated successfully.</p>
            </div>
          ) : (
            <>
              <Input 
                type="password" 
                label="Current Password" 
                placeholder="Enter current password" 
              />
              <Input 
                type="password" 
                label="New Password" 
                placeholder="Enter new password" 
              />
              <Input 
                type="password" 
                label="Confirm New Password" 
                placeholder="Confirm new password" 
              />
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 mt-2">
                <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* DELETE ACCOUNT MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete your account?"
        size="md"
      >
        <div className="mt-2 space-y-4">
          <p className="text-sm text-neutral-500">
            Deleting your account is a permanent action. This frontend demo does not currently perform account deletion.
          </p>
          
          {deleteMessage && (
            <div className="rounded-lg bg-error-50 p-3 text-sm text-error-700 font-medium">
              {deleteMessage}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </CandidateLayout>
  );
}
