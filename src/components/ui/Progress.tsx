interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  showLabel?: boolean;
  className?: string;
}

const sizeStyles: Record<NonNullable<ProgressProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const variantStyles: Record<NonNullable<ProgressProps["variant"]>, string> = {
  default: "bg-accent-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  error: "bg-error-500",
};

export default function Progress({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  className = "",
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className="text-sm text-neutral-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-neutral-200 ${sizeStyles[size]}`}>
        <div
          className={`h-full rounded-full ${variantStyles[variant]}`}
          style={{ width: `${percentage}%`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
