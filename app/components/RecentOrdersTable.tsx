'use client';

import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

interface Order {
  order_id: number;
  customer: { first_name: string; last_name: string; phone: string };
  status: { description: string };
  price: number;
  purchase_date: string;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const ITEMS_PER_PAGE = 10;
const COLUMNS = 6;

const STATUS_OPTIONS = [
  "Money Recieved",
  "Purchased",
  "Dispatched",
  "In Transit",
  "In local Country",
  "Delivered",
];

export default function RecentOrders({ orders = [] }: RecentOrdersProps) {
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingIds, setUpdatingIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLocalOrders(orders);
    setCurrentPage(1);
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(localOrders.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = useMemo(
    () => localOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [localOrders, startIndex]
  );

  const emptyRows = Math.max(0, ITEMS_PER_PAGE - paginatedOrders.length);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    // optimistic UI
    console.log(orderId);
    setLocalOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? { ...o, status: { description: newStatus } } : o))
    );
    setUpdatingIds((s) => ({ ...s, [orderId]: true }));

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      const data = await res.json();
      if (data?.order) {
        // sync with server response
        setLocalOrders((prev) => prev.map((o) => (o.order_id === orderId ? data.order : o)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      // rollback: refetch or revert UI — here we revert by refetching the single order from server
      try {
        const r = await fetch(`/api/admin/orders?orderId=${orderId}`);
        if (r.ok) {
          const d = await r.json();
          if (d?.orders?.length) {
            setLocalOrders((prev) => prev.map((o) => (o.order_id === orderId ? d.orders[0] : o)));
          }
        }
      } catch (e) {
        // best-effort; leave optimistic change if rollback can't be performed
      }
    } finally {
      setUpdatingIds((s) => {
        const copy = { ...s };
        delete copy[orderId];
        return copy;
      });
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
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
            {localOrders.length === 0 ? (
              <>
                <tr>
                  <td colSpan={COLUMNS} className="px-4 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
                {Array.from({ length: ITEMS_PER_PAGE - 1 }).map((_, i) => (
                  <tr key={`empty-noorders-${i}`} className="border-b">
                    {Array.from({ length: COLUMNS }).map((__, col) => (
                      <td
                        key={col}
                        className="px-4 py-2 text-center text-transparent select-none"
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              <>
                {paginatedOrders.map((order) => (
                  <tr key={order.order_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{order.order_id}</td>
                    <td className="px-4 py-2">
                      {order.customer.first_name} {order.customer.last_name}
                    </td>
                    <td className="px-4 py-2">{order.customer.phone}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status?.description || ""}
                        onChange={(e) => updateStatus(order.order_id, e.target.value)}
                        disabled={Boolean(updatingIds[order.order_id])}
                        className="px-2 py-1 rounded border text-sm"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      £{order.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.purchase_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {/* pad with empty rows to keep table height stable */}
                {Array.from({ length: emptyRows }).map((_, i) => (
                  <tr key={`empty-${i}`} className="border-b">
                    {Array.from({ length: COLUMNS }).map((__, col) => (
                      <td
                        key={col}
                        className="px-4 py-2 text-center text-transparent select-none"
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  );
}