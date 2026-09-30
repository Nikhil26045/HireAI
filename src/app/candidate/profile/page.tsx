"use client";

import { useState } from "react";
import CandidateLayout from "@/components/layouts/CandidateLayout";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Camera,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Mock data state
  const [profileData, setProfileData] = useState({
    fullName: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "+91 98765 43210",
    location: "Jaipur, India",
    jobTitle: "Software Developer",
    experience: "1 Year",
    company: "—",
    employmentStatus: "Open to Opportunities",
    summary:
      "Passionate software developer with a strong foundation in modern web technologies. Eager to contribute to innovative projects and continuously learn new skills.",
    degree: "B.Tech",
    university: "SKIT Jaipur",
    field: "Computer Science & Engineering",
    gradYear: "2027",
  });

  const [skills, setSkills] = useState([
    "Java",
    "Python",
    "React",
    "Next.js",
    "SQL",
    "Git",
    "REST APIs",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);

    // Allow selecting the same image again after changing/removing it
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
  };

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // In a real app we'd reset the form to original data here
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <CandidateLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-6 right-6 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-2 duration-300">
            <CheckCircle2 size={20} className="text-success-600" />
            <span className="font-medium">
              Profile updated successfully!
            </span>
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <Link
              href="/candidate"
              className="inline-flex items-center text-sm font-medium text-neutral-500 hover:text-navy-600 transition-colors mb-4 group"
            >
              <ChevronLeft
                size={16}
                className="mr-1 group-hover:-translate-x-1 transition-transform"
              />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
              My Profile
            </h1>

            <p className="mt-1 text-neutral-500 text-base">
              Manage your personal and professional information.
            </p>
          </div>

          {/* Profile Completion Indicator in Header */}
          {!isEditing && (
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-neutral-200 shadow-sm">
              <div className="relative w-10 h-10 flex-shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-neutral-100"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    className="text-accent-500 transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div>
                <div className="text-sm font-bold text-navy-900">
                  75% Complete
                </div>

                <div className="text-xs text-neutral-500">
                  Almost complete
                </div>
              </div>
            </div>
          )}

          {isEditing && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* PROFILE HEADER CARD */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden relative transition-shadow hover:shadow-card">
              {/* Navy Profile Banner */}
              <div className="h-28 bg-gradient-to-r from-navy-900 to-navy-700 relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
              </div>

              <div className="px-6 sm:px-8 pb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  {/* Profile Avatar */}
                  <div className="relative -mt-16 mb-2 sm:mb-4">
                    <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-md">
                      <div className="w-full h-full rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100 relative overflow-hidden group">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} strokeWidth={1} />
                        )}

                        {/* Image Actions */}
                        {isEditing && (
                          <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-3">
                              {/* Change Photo */}
                              <label
                                htmlFor="profile-image-upload"
                                className="w-9 h-9 rounded-full bg-white/95 text-navy-900 flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm"
                                title="Change photo"
                              >
                                <Camera size={18} />

                                <input
                                  id="profile-image-upload"
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                              </label>

                              {/* Remove Photo */}
                              {profileImage && (
                                <button
                                  type="button"
                                  onClick={handleRemovePhoto}
                                  className="w-9 h-9 rounded-full bg-white/95 text-red-600 flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm"
                                  title="Remove photo"
                                  aria-label="Remove profile photo"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isEditing && (
                    <Button
                      variant="outline"
                      className="shadow-sm sm:mb-4 w-full sm:w-auto"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-navy-900">
                    {profileData.fullName}
                  </h2>

                  <p className="text-lg font-medium text-accent-600 mt-1">
                    {profileData.jobTitle}
                  </p>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin
                        size={16}
                        className="text-neutral-400"
                      />
                      {profileData.location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Mail
                        size={16}
                        className="text-neutral-400"
                      />
                      {profileData.email}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Phone
                        size={16}
                        className="text-neutral-400"
                      />
                      {profileData.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL INFORMATION */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-card">
              <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-accent-500" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* PROFESSIONAL INFORMATION */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-card">
              <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                <Briefcase size={20} className="text-accent-500" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  label="Current Job Title"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Years of Experience"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Current Company"
                  name="company"
                  value={profileData.company}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Employment Status
                  </label>

                  <select
                    name="employmentStatus"
                    value={profileData.employmentStatus}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 transition-colors duration-150 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500 h-[38px]"
                  >
                    <option>Open to Opportunities</option>
                    <option>Actively Looking</option>
                    <option>Not Looking</option>
                  </select>
                </div>
              </div>

              <Textarea
                label="Professional Summary"
                name="summary"
                value={profileData.summary}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
              />
            </div>

            {/* EDUCATION */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-card">
              <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
                <GraduationCap
                  size={20}
                  className="text-accent-500"
                />
                Education
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Degree"
                  name="degree"
                  value={profileData.degree}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Field of Study"
                  name="field"
                  value={profileData.field}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="University / College"
                  name="university"
                  value={profileData.university}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Graduation Year"
                  name="gradYear"
                  value={profileData.gradYear}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* COMPLETE YOUR PROFILE */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 relative overflow-hidden transition-shadow hover:shadow-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-navy-900 mb-1">
                  Complete your profile
                </h3>

                <p className="text-sm text-neutral-500 mb-5">
                  You&apos;re almost there. Complete the remaining item to
                  strengthen your profile.
                </p>

                <div className="mb-6">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-black text-navy-900">
                      75%
                    </span>

                    <span className="text-sm font-medium text-accent-600">
                      Almost complete
                    </span>
                  </div>

                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-neutral-900 mb-2">
                    What&apos;s left:
                  </p>

                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-4 w-4 rounded-full bg-accent-500 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} />
                    </div>

                    <span className="text-neutral-500 line-through">
                      Complete professional summary
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-4 w-4 rounded-full bg-accent-500 text-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={12} />
                    </div>

                    <span className="text-neutral-500 line-through">
                      Add education details
                    </span>
                  </div>

                  <div className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center flex-shrink-0" />

                    <span className="text-neutral-900 font-medium">
                      Add profile photo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 transition-shadow hover:shadow-card">
              <h3 className="text-lg font-bold text-navy-900 mb-4">
                Skills
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="primary"
                    className="px-3 py-1.5 text-sm gap-1"
                  >
                    {skill}

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-accent-800 focus:outline-none transition-colors ml-1"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                  <Input
                    placeholder="E.g. TypeScript"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && addSkill()
                    }
                    className="flex-1"
                  />

                  <Button
                    onClick={addSkill}
                    variant="secondary"
                    className="px-3 shrink-0 h-[38px]"
                  >
                    <Plus size={18} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}