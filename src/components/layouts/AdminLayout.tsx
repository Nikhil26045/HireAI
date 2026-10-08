import { type ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-neutral-200 px-5">
          <img src="/logo.png" alt="HireAI Logo" className="w-12 h-auto" />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          <span className="block px-3 py-2 text-sm font-medium text-neutral-400">
            Admin navigation coming soon
          </span>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b border-neutral-200 bg-white px-4 lg:px-6">
          <span className="text-sm text-neutral-500">Admin Portal</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
