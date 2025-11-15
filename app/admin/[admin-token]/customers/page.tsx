'use client';   

import AdminActionCards from "@/app/components/admin/AdminActionCards";
import { useState } from "react";

export default function Customers() {
    const [loading, setLoading] = useState(true);
    
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <AdminActionCards 
                    title="Add New Customer" 
                    description="Create a new customer profile in the system."
                    color="bg-green-600"
                />
                <AdminActionCards 
                    title="View All Customers" 
                    description="Browse and manage existing customer accounts."
                    color="bg-blue-600"
                />
            </div>
        </>
    )
}