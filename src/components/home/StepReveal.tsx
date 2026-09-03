"use client";

import { useEffect, useRef, useState } from "react";

interface StepRevealProps {
  count: number;
  stepDelay?: number;
  className?: string;
}

export default function StepReveal({ count, stepDelay = 120, className = "" }: StepRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasStarted.current) return;
    if (typeof IntersectionObserver === "undefined") {
      hasStarted.current = true;
      setVisibleCount(count);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true;
            for (let i = 1; i <= count; i++) {
              setTimeout(() => setVisibleCount(i), i * stepDelay);
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, stepDelay]);

  return (
    <div ref={ref} className={className} data-visible-count={visibleCount} />
  );
}
