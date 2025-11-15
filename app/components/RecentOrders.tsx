'use client';

import { useState, useMemo } from "react";
import Pagination from "./Pagination";

interface Order {
  order_id: number;
  customer: { first_name: string; last_name: string; phone: string };
  status: { description: string };
  price: number;
  purchase_date: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const ITEMS_PER_PAGE = 10;

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = useMemo(
    () => orders.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [orders, startIndex]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

      <div className="overflow-x-auto bg-white rounded shadow-">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.order_id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">#{order.order_id}</td>
                  <td className="px-4 py-2">
                    {order.customer.first_name} {order.customer.last_name}
                  </td>
                  <td className="px-4 py-2">{order.customer.phone}</td>
                  <td className="px-4 py-2">
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-xs font-medium">
                      {order.status.description}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold">
                    £{order.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.purchase_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
  );
}