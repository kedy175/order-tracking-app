'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderForm() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();
    setLoading(false);

    // ✅ If result is valid, redirect
    if (data.message === "Order found" || data.success) {
      router.push(`/order-status/${orderId}`);
    } else {
      alert("Order not found!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          className="border border-gray-400 p-2 rounded"
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
