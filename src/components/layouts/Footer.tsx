import Link from "next/link";

const footerLinks = {
  product: [
    { label: "Features", href: "/services" },
    { label: "How It Works", href: "/why-hireai" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Why HireAI", href: "/why-hireai" },
    { label: "Contact Us", href: "/contact" },
  ],
  access: [
    { label: "Login", href: "/login" },
    { label: "Get Started", href: "/register" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-[1.1rem] font-bold tracking-tight text-navy-800">
              HireAI
            </Link>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-400">
              AI-powered candidate evaluation for more structured, informed recruitment.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-800">Product</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-neutral-400 transition-colors hover:text-accent-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-800">Company</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-neutral-400 transition-colors hover:text-accent-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Access */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-800">Access</h4>
            <ul className="mt-3 space-y-2">
              {footerLinks.access.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-neutral-400 transition-colors hover:text-accent-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200/80 pt-5">
          <p className="text-center text-[12px] text-neutral-400">
            &copy; {new Date().getFullYear()} HireAI. AI-powered hiring platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
