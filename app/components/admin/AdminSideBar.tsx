'use client';

import { LayoutDashboard, Users, PackageSearch, Settings, LogOut, Briefcase, BarChart } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AdminSideBarProps {
  pathname?: string;
}

export default function AdminSideBar({ pathname }: AdminSideBarProps) {
  const params = useParams();
  console.log(pathname)
  const adminToken = params?.["admin-token"] || "123"; // fallback to 123 if not available

  const isActive = (route: string) => pathname?.includes(route);

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: `/admin/${adminToken}/dashboard`,
      route: "dashboard",
    },
    {
      label: "Customers",
      icon: Users,
      href: `/admin/${adminToken}/customers`,
      route: "customers",
    },
    {
      label: "Orders",
      icon: PackageSearch,
      href: `/admin/${adminToken}/orders`,
      route: "orders",
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: `/admin/${adminToken}/analytics`,
      route: "analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: `/admin/${adminToken}/settings`,
      route: "settings",
    },
  ];

  return (
    <div className="w-64 h-full bg-[#0C2D4E] text-white p-4 border-r border-[#0A233C] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#0A233C]">
          <Briefcase size={24} className="text-blue-600" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.route);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 py-2 px-2 rounded transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-200 hover:bg-[#10375D]"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded mt-4 w-full justify-center transition">
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}