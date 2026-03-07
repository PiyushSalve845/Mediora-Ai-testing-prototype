'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/medicines', label: 'Meds', icon: '💊' },
  { href: '/reminders', label: 'Remind', icon: '🔔' },
  { href: '/interactions', label: 'Check', icon: '⚠️' },
  { href: '/assistant', label: 'AI', icon: '🤖' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 ${
              pathname === item.href ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            <span className={`text-xl p-1 rounded-lg ${pathname === item.href ? 'bg-indigo-100' : ''}`}>
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}