'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: 'POS', href: '/pos' },
    { name: 'Menu', href: '/dashboard' },
    { name: 'Orders', href: '/orders' },
  ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="h-6 w-px bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          {/* ต้องแก้เอาข้อมูลพนักงานจริง ๆ มาใส่ */}
          <span className="text-sm font-medium">Somchai L.</span>
          <span className="text-xs text-gray-500">Cashier</span>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </header>
  );
} 