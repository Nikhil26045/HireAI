"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface InViewportProps {
  children: ReactNode;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "section" | "header" | "span" | "ul" | "li";
  /** When provided, sets this data-* attribute to "true" when in view (e.g. "cp-in-view") */
  dataAttr?: string;
}

export default function InViewport({
  children,
  threshold = 0.2,
  once = true,
  className = "",
  dataAttr,
}: InViewportProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      if (dataAttr) node.setAttribute(`data-${dataAttr}`, "true");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (dataAttr) node.setAttribute(`data-${dataAttr}`, "true");
            if (once) observer.disconnect();
          } else if (!once) {
            if (dataAttr) node.setAttribute(`data-${dataAttr}`, "false");
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once, dataAttr]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
