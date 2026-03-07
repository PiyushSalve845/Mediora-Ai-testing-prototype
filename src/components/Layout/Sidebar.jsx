'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/medicines', label: 'Medicines', icon: '💊' },
  { href: '/reminders', label: 'Reminders', icon: '🔔' },
  { href: '/interactions', label: 'Interactions', icon: '⚠️' },
  { href: '/assistant', label: 'AI Assistant', icon: '🤖' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/caregiver', label: 'Caregiver', icon: '👥' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl">❤️</div>
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Mediora AI</h1>
            <p className="text-xs text-gray-500">Smart Medication</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === item.href
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-400 text-center">Created by Piyush Salve</p>
      </div>
    </aside>
  );
}