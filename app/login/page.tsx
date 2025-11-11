'use client';

import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ phone: "", password: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    // later: call your API endpoint here
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);
    setLoading(false);
    setMsg(data.message || (data.success ? "Successful!" : "Failed"));
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Login</h1>

      <form
        onSubmit={submit}
        className="flex flex-col gap-4 border border-gray-300 p-6 rounded-md w-full max-w-sm"
      >
        <p>Phone Number</p>
        <input
          type="text"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
          className="border border-gray-300 rounded p-2"
        />
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          className="border border-gray-300 rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        
      </form>
      {msg && <p className="text-center text-sm">{msg}</p>}
    </main>
  );
}
