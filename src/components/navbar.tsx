"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Why HireAI", href: "/why-hireai" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        {/* ── Brand ── */}
        <Link href="/" className="flex items-center text-[1.35rem] font-bold tracking-tight text-navy-800">
          HireAI
        </Link>

        {/* ── Desktop navigation ── */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-150 ${
                isActive(link.href)
                  ? "bg-accent-50 text-accent-600"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-navy-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Desktop CTAs ── */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-[13px] font-medium text-neutral-500 transition-all duration-150 hover:bg-neutral-50 hover:text-navy-800"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-navy-800 px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-navy-700 active:bg-navy-900"
          >
            Get Started
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-t border-neutral-200/80 bg-white md:hidden">
          <div className="space-y-0.5 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-accent-50 text-accent-600"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-navy-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-neutral-200/80 px-4 py-3">
            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3.5 py-2.5 text-center text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-navy-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-navy-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
