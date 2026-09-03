"use client";

import { useEffect, useRef, useState } from "react";

interface ProgressiveLineProps {
  className?: string;
  vertical?: boolean;
  delay?: number;
  threshold?: number;
}

export default function ProgressiveLine({ className = "", vertical = false, delay = 0, threshold = 0.2 }: ProgressiveLineProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setDrawn(true), delay);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay, threshold]);

  if (vertical) {
    return (
      <div
        ref={ref}
        className={`relative w-[2px] overflow-hidden bg-accent-200/60 ${className}`}
      >
        <div
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-accent-400 via-accent-500 to-accent-400"
          style={{
            height: drawn ? "100%" : "0%",
            transition: "height 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative h-[2px] overflow-hidden bg-accent-200/60 ${className}`}
    >
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-400"
        style={{
          width: drawn ? "100%" : "0%",
          transition: "width 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}
