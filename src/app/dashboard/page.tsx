import RecruiterLayout from "@/components/layouts/RecruiterLayout";

export default function DashboardPage() {
  return (
    <RecruiterLayout>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Recruiter Dashboard</h1>
        <p className="mt-2 text-neutral-500">
          This page will host the recruiter-facing dashboard and analytics.
        </p>
      </div>
    </RecruiterLayout>
  );
}
