'use client';

import { useState } from "react";
import { UserCircle } from "lucide-react";


interface AdminNavBarProps {
  pathname?: string;
}

export default function AdminNavBar({ pathname }: AdminNavBarProps) {
  // Determine title based on current route
  const getPageTitle = () => {
    if (pathname?.includes("customers")) return "Customers";
    if (pathname?.includes("orders")) return "Orders";
    if (pathname?.includes("analytics")) return "Analytics";
    return "Admin Dashboard";
  };
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b h-16">
      <div className="max-w-5xl mx-auto flex items-center px-4 h-full">
        <div className="flex-1 flex justify-start">
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition"
            >
              <UserCircle size={32} className="text-gray-600" />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 text-sm z-50">
                {/* dropdown options... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
