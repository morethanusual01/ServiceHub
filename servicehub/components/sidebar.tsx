'use client';

import { Link } from '@heroui/link';
import { usePathname } from 'next/navigation';
import {
  Squares2X2Icon as DashboardIcon,
  UsersIcon,
  CalendarIcon,
  TruckIcon,
  WrenchIcon as ToolsIcon,
  PhoneIcon as HeadsetIcon,
  TagIcon,
  ChartBarIcon,
  Cog6ToothIcon as SettingsIcon,
  ShieldCheckIcon as LogoIcon,
} from '@heroicons/react/24/solid';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { name: 'Client Requests', href: '/client-requests', icon: UsersIcon },
  { name: 'All Events', href: '/events', icon: CalendarIcon },
  { name: 'Field Engineering', href: '/field-events', icon: TruckIcon },
  { name: 'Parts', href: '/parts-events', icon: ToolsIcon },
  { name: 'Remote Support', href: '/remote-support', icon: HeadsetIcon },
  { name: 'Outstanding Offers', href: '/offers', icon: TagIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-background border-r border-divider flex flex-col">
      <div className="p-4 border-b border-divider">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md shadow-sm flex items-center justify-center transform -rotate-6">
                <span className="text-white font-semibold text-sm tracking-wider transform rotate-6">C</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary-300 rounded-full shadow-sm" />
            </div>
            <div className="ml-2 flex items-baseline">
              <span className="text-base font-semibold text-foreground">CoverIT</span>
              <div className="mx-1.5 h-3 w-[1px] bg-divider opacity-50"></div>
              <span className="text-sm font-medium text-default-500">Service Hub</span>
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors relative group ${
                isActive
                  ? 'bg-primary-500/10 text-primary-500 before:absolute before:left-0 before:top-[12px] before:bottom-[12px] before:w-1 before:bg-primary-500 before:rounded-r'
                  : 'text-default-600 hover:bg-primary-500/10 [&:hover]:opacity-100'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 