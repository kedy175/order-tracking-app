'use client';   

import AdminActionCards from "@/app/components/admin/AdminActionCards";
import AdminStatsCards from "@/app/components/admin/AdminStatsCards";
import CustomerTable from "@/app/components/CustomersTable";
import { useState, useEffect } from "react";

export default function Customers() {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        mostOrders: 0,
        highestSpentAmount: 0,
        highestSpentCustomerId: 0,
    });
        
    useEffect(() => {
    const fetchOrders = async () => {
        try {
        const res = await fetch("/api/admin/customers");
        const data = await res.json();
        
        setCustomers(data.customers || []);
        // Calculate stats
        const allCustomers = data.customers || [];
        const total = allCustomers.length;

        const mostOrders = allCustomers.reduce((max: number, c: any) => 
            c.orders.length > max ? c.orders.length : max
        , 0);   

        // compute highest spent and the customer id who spent it
        let highestSpentAmount = 0;
        let highestSpentCustomerId = 0;
        for (const c of allCustomers) {
          const totalSpent = (c.orders || []).reduce((sum: number, o: any) => sum + (o.price || 0), 0);
          if (totalSpent > highestSpentAmount) {
            highestSpentAmount = totalSpent;
            highestSpentCustomerId = c.customer_id;
          }
        }

        // round to 0 decimal places (integer)
        const roundedHighest = Number(highestSpentAmount.toFixed(2));

        setStats({ total, mostOrders, highestSpentAmount: roundedHighest, highestSpentCustomerId });

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
                    label="Total Customers"
                    value={
                      loading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        <span className="text-3xl font-bold ">{stats.total}</span>
                      )
                    }
                  />
                  <AdminStatsCards
                    label="Most Orders by Customer"
                    value={
                      loading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        <span className="text-3xl font-bold text-yellow-600">
                          {stats.mostOrders}
                        </span>
                      )
                    }
                  />
                  <AdminStatsCards
                    label="Higest Spending Customer ID"
                    value={
                      loading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        <span className="text-3xl font-bold text-purple-600">
                          {stats.highestSpentCustomerId}
                        </span>
                      )
                    }
                  />
                  <AdminStatsCards
                    label="Highest Amount Spent by Customer (£)"
                    value={
                      loading ? (
                        <span className="text-gray-400">Loading...</span>
                      ) : (
                        <span className="text-3xl font-bold text-green-600">
                          £{stats.highestSpentAmount}
                        </span>
                      )
                    }
                  />
                </div>
            <section className="mt-8">
                <h2 className="text-lg font-semibold mb-3">Modify Customers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AdminActionCards 
                        title="Add New Customer" 
                        description="Create a new customer profile in the system."
                        color="bg-emerald-600"
                    />
                    <AdminActionCards 
                        title="Update Customer Info" 
                        description="Change details of existing customers."
                        color="bg-sky-600"
                    />
                    <AdminActionCards 
                        title="Delete Customer Info" 
                        description="Delete details of existing customers."
                        color="bg-rose-600"
                    />
                </div>
            </section>
            <CustomerTable customers={customers}/>
        </>
    )
}