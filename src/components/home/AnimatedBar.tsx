"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedBarProps {
  value: number;
  max?: number;
  trigger?: boolean;
  className?: string;
  fillClassName?: string;
}

export default function AnimatedBar({
  value,
  max = 100,
  trigger = true,
  className = "",
  fillClassName = "bg-accent-500",
}: AnimatedBarProps) {
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;
    const duration = 1000;
    const start = performance.now();
    let frame: number;
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [trigger, value]);

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-neutral-200 ${className}`}>
      <div
        className={`h-full rounded-full ${fillClassName}`}
        style={{ width: `${percentage * progress}%`, transition: "width 0.05s linear" }}
      />
    </div>
  );
}
