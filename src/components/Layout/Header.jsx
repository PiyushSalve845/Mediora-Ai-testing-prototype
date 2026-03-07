'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-indigo-600">Mediora AI</h1>
        </div>
        <div className="hidden md:block"></div>
        <div className="flex items-center gap-3">
          <Link href="/reminders" className="relative p-2 hover:bg-gray-100 rounded-xl">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          <Link href="/about" className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            P
          </Link>
        </div>
      </div>
    </header>
  );
}