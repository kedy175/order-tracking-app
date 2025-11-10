'use client';

import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full">
      <div className="max-w-5xl mx-auto flex items-center px-4 py-3">
        {/* Left */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-lg font-semibold">Home</Link>
        </div>

        {/* Center */}
        <div className="flex-1 flex justify-center">
          <Link href="/" aria-label="Home">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        {/* Right */}
        <div className="flex-1 flex justify-end">
          <Link href="/login" className="text-lg font-semibold whitespace-nowrap">
            Login / Register
          </Link>
        </div>
      </div>
    </nav>
  );
}