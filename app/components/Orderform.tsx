// ...existing code...
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ orderId: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (data.message === "Order found" || data.success) {
      router.push(data.redirect);
    } else {
      setError("Order not found. Please verify the Order ID and phone number.");
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
          required
        />
        <p>Phone Number</p>
        <input
          value={form.phone ?? ''}
          onChange={(e) => setForm({...form, phone: e.target.value})}
          placeholder="Enter Phone Number"
          className="border border-gray-400 p-2 rounded mb-4"
          type="tel"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
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