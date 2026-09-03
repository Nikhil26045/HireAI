import { type ReactNode } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name: string;
  imageSrc?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const sizes: Record<AvatarSize, { container: string; placeholder: string }> = {
  sm: { container: "h-8 w-8 text-xs", placeholder: "text-sm" },
  md: { container: "h-10 w-10 text-sm", placeholder: "text-base" },
  lg: { container: "h-12 w-12 text-base", placeholder: "text-lg" },
  xl: { container: "h-16 w-16 text-lg", placeholder: "text-2xl" },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Avatar({
  name,
  imageSrc,
  size = "md",
  className = "",
}: AvatarProps) {
  const style = sizes[size];

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={name}
        className={`inline-flex items-center justify-center rounded-full object-cover ${style.container} ${className}`}
      />
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 ${style.container} ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </span>
  );
}

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ children, max = 4, size = "md" }: AvatarGroupProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const visible = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className="flex -space-x-2">
      {visible}
      {remaining > 0 && (
        <span
          className={`inline-flex items-center justify-center rounded-full border-2 border-white bg-neutral-100 font-medium text-neutral-600 ${sizeStyles[size]}`}
        >
          +{remaining}
        </span>
      )}
    </div>
  );
}
