'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, Plus, List, Menu, X } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const NavItem = ({
    href,
    label,
    Icon,
  }: {
    href: string;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
        pathname === href ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="w-full border-b bg-[#f7f7fb]">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: logo + title */}
            <Link href="/" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                School Directory
              </span>
            </Link>

            {/* Right: desktop links */}
            <div className="hidden md:flex items-center gap-8">
              <NavItem href="/addSchool" label="Add School" Icon={Plus} />
              <NavItem href="/showSchools" label="View Schools" Icon={List} />
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="md:hidden border-t py-2">
              <div className="flex flex-col gap-2">
                <NavItem href="/addSchool" label="Add School" Icon={Plus} />
                <NavItem href="/showSchools" label="View Schools" Icon={List} />
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 School Management System | Built with Next.js & MySQL
          </p>
        </div>
      </footer>
    </div>
  );
}
