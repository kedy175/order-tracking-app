'use client';

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ phone: "", first_name: "", last_name: "", password: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    console.log(data);
    setLoading(false);
    setMsg(data.message || (data.success ? "Registered!" : "Failed"));
    if (data.success) {
      // e.g., redirect to login
      // router.push("/login");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm border p-6 rounded space-y-3">
        <p>Phone Number</p>
        <input className="border p-2 w-full" placeholder="Phone"
          value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <p>First Name</p>
        <input className="border p-2 w-full" placeholder="First name"
          value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})}/>
        <p>Last Name</p>
        <input className="border p-2 w-full" placeholder="Last name"
          value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})}/>
        <p>Password</p>
        <input type="password" className="border p-2 w-full" placeholder="Password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button disabled={loading} className="bg-blue-600 text-white py-2 rounded w-full">
          {loading ? "Registering..." : "Register"}
        </button>
        {msg && <p className="text-center text-sm">{msg}</p>}
      </form>
    </main>
  );
}
