"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "fade" | "reveal" | "stagger";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: "div" | "section" | "header" | "span";
}

export default function ScrollReveal({
  children,
  variant = "reveal",
  className = "",
  delay = 0,
  threshold = 0.15,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const variantClass =
    variant === "fade" ? "hf-fade" : variant === "stagger" ? "hf-stagger" : "hf-reveal";

  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLDivElement & HTMLElement>}
      className={`${variantClass} ${visible ? "is-visible" : ""} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  );
}
