import { type ReactNode } from "react";
import Spinner from "@/components/ui/Spinner";

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function LoadingState({
  title = "Loading...",
  description,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center ${className}`}
    >
      <Spinner size="lg" />
      <h3 className="mt-4 text-sm font-semibold text-neutral-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-neutral-500">{description}</p>
      )}
    </div>
  );
}

interface ProcessingStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function ProcessingState({
  title = "Processing...",
  description,
  className = "",
}: ProcessingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-primary-200 bg-primary-50 px-6 py-12 text-center ${className}`}
    >
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-4 border-primary-200" />
        <div className="absolute inset-0 h-10 w-10 animate-spin rounded-full border-4 border-transparent border-t-primary-600" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-primary-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-primary-700">{description}</p>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this content. Please try again.",
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-error-500/20 bg-error-50 px-6 py-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 text-error-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-error-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-error-700">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SuccessState({
  title = "Success",
  description,
  action,
  className = "",
}: SuccessStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-success-500/20 bg-success-50 px-6 py-12 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-500/10 text-success-600">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <h3 className="mt-4 text-sm font-semibold text-success-700">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-success-700/80">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
