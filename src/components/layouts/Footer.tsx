import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "/services" },
    { label: "How It Works", href: "/why-hireai" },
  ],
  company: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Why HireAI", href: "/why-hireai" },
    { label: "Contact Us", href: "/contact" },
  ],
  access: [
    { label: "Login", href: "/login" },
    { label: "Get Started", href: "/register" },
  ],
};

const contactDetails = [
  {
    label: "hello@hireai.com",
    href: "mailto:hello@hireai.com",
    icon: Mail,
  },
  {
    label: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    icon: Phone,
  },
  {
    label: "Jaipur, India",
    href: "/contact",
    icon: MapPin,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-blue-100 bg-[#EEF6FF]">
      {/* Subtle background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-accent-500/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-indigo-500/[0.05] blur-3xl" />

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.1fr_1fr] lg:gap-10">
          {/* Brand + Contact */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-900 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </span>

              <span className="text-xl font-extrabold tracking-tight text-navy-900">
                HireAI
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
              AI-powered candidate evaluation for more structured,
              informed, and efficient recruitment.
            </p>

            {/* Status badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-600">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
              AI-powered hiring
            </div>

            {/* Contact details */}
            <div className="mt-5 space-y-2.5">
              {contactDetails.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-2.5 text-[13px] text-neutral-500 transition-colors duration-200 hover:text-accent-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white/70 text-neutral-500 transition-colors duration-200 group-hover:border-blue-200 group-hover:text-accent-600">
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-navy-900">
              Product
            </h4>

            <ul className="mt-4 space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:text-accent-600"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-navy-900">
              Company
            </h4>

            <ul className="mt-4 space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:text-accent-600"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-navy-900">
              Access
            </h4>

            <ul className="mt-4 space-y-2.5">
              {footerLinks.access.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-neutral-500 transition-colors duration-200 hover:text-accent-600"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-9 flex flex-col gap-3 border-t border-blue-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} HireAI. All rights reserved.
          </p>

          <p className="text-xs font-medium text-neutral-400">
            AI-powered hiring platform
          </p>
        </div>
      </div>
    </footer>
  );
}