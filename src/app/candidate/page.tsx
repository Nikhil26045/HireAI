import CandidateLayout from "@/components/layouts/CandidateLayout";

export default function CandidatePage() {
  return (
    <CandidateLayout>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Candidate Assessment Flow
        </h1>
        <p className="mt-2 text-neutral-500">
          This page will host the candidate-facing assessment experience.
        </p>
      </div>
    </CandidateLayout>
  );
}
