'use client';

import AdminNavBar from "@/app/components/admin/AdminNavBar";
import AdminSideBar from "@/app/components/admin/AdminSideBar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 mt-5">
      {/* Fixed top navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40">
        <AdminNavBar pathname={pathname} />
      </header>

      {/* Fixed sidebar under navbar */}
      <aside className="fixed top-16 left-0 bottom-0 w-64 z-30">
        <AdminSideBar pathname={pathname} />
      </aside>

      <main className="pt-16 ml-64 p-6">
        {children}
      </main>
    </div>
  );
}