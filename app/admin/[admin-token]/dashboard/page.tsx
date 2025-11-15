'use client';

import AdminActionCards from "@/app/components/admin/AdminActionCards";
import AdminNavBar from "@/app/components/admin/AdminNavBar";
import AdminSideBar from "@/app/components/admin/AdminSideBar";
import AdminStatsCards from "@/app/components/admin/AdminStatsCards";
import RecentOrders from "@/app/components/RecentOrders";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    delivered: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);

        // Calculate stats
        const allOrders = data.orders || [];
        const total = allOrders.length;
        const pending = allOrders.filter(
          (o: any) => o.status.description !== "Delivered"
        ).length;
        const delivered = allOrders.filter(
          (o: any) => o.status.description === "Delivered"
        ).length;
        const revenue = allOrders.reduce((sum: number, o: any) => sum + o.price, 0);

        setStats({ total, pending, delivered, revenue });
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
        <>
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatsCards
            label="Total Orders"
            value={
              loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                <span className="text-3xl font-bold">{stats.total}</span>
              )
            }
          />
          <AdminStatsCards
            label="Pending Orders"
            value={
              loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                <span className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </span>
              )
            }
          />
          <AdminStatsCards
            label="Delivered Orders"
            value={
              loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                <span className="text-3xl font-bold text-green-600">
                  {stats.delivered}
                </span>
              )
            }
          />
          <AdminStatsCards
            label="Total Revenue"
            value={
              loading ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  £{stats.revenue.toFixed(2)}
                </span>
              )
            }
          />
        </div>

        {/* Quick actions */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AdminActionCards
              title="Add New Order"
              description="Create a new order from a customer request."
              color="bg-green-600"
            />

            <AdminActionCards
              title="Update Order Status"
              description="Quickly change the status of an existing order."
              color="bg-blue-600"
            />

            <AdminActionCards
              title="Search Order by Phone"
              description="Find orders by customer phone number."
              color="bg-indigo-600"
            />

            <AdminActionCards
              title="Add New Customer"
              description="Create a new customer profile in the system."
              color="bg-slate-600"
            />

            <AdminActionCards
              title="View Pending Orders"
              description="See all orders that are not yet delivered."
              color="bg-yellow-500"
            />

            <AdminActionCards
              title="Analytics"
              description="View high-level metrics and performance insights."
              color="bg-purple-600"
            />
          </div>
        </section>

        {/* Recent Orders Table */}
        {loading ? (
          <p className="mt-8">Loading orders...</p>
        ) : (
          <RecentOrders orders={orders} />
        )}
    </>
  );
}