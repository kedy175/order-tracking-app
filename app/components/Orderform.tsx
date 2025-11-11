'use client';

import { useState } from "react";
import { notFound, useRouter } from "next/navigation";

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ orderId: "", phone: "" });
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    // ✅ If result is valid, redirect
    if (data.message === "Order found" || data.success) {
      router.push(data.redirect);
    } else {
      notFound();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <p className="">Order Id</p>
        <input
          value={form.orderId ?? ''}
          onChange={(e) => setForm({...form, orderId: e.target.value})}
          placeholder="Enter Order ID"
          className="border border-gray-400 p-2 rounded mb-4"
        />
        <p >Phone Number</p>
        <input
          value={form.phone ?? ''}
          onChange={(e) => setForm({...form, phone: e.target.value})}
          placeholder="Enter Phone Number"
          className="border border-gray-400 p-2 rounded mb-4"
          type="number"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>
    </div>
  );
}
