// ...existing code...
'use client';

import { useState, useMemo } from "react";
import Pagination from "./Pagination";

interface Customer {
  customer_id: number;
  phone: string;
  first_name: string;
  last_name: string;
  orders: [];
}

interface CustomersTableProps {
  customers?: Customer[];
}

const ITEMS_PER_PAGE = 10;
const COLUMNS = 5;

export default function CustomerTable({ customers = [] }: CustomersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(customers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCustomers = useMemo(
    () => customers.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [customers, startIndex]
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const emptyRows = Math.max(0, ITEMS_PER_PAGE - paginatedCustomers.length);

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Customers</h2>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left">Customer ID</th>
              <th className="px-4 py-2 text-left">First Name</th>
              <th className="px-4 py-2 text-left">Last Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-center">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.length > 0 ? (
              <>
                {paginatedCustomers.map((c) => (
                  <tr key={c.customer_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">#{c.customer_id}</td>
                    <td className="px-4 py-2">{c.first_name}</td>
                    <td className="px-4 py-2">{c.last_name}</td>
                    <td className="px-4 py-2">{c.phone}</td>
                    <td className="px-4 py-2 text-center">{c.orders.length}</td>
                  </tr>
                ))}

                {/* pad with empty rows to keep table height stable */}
                {Array.from({ length: emptyRows }).map((_, i) => (
                  <tr key={`empty-${i}`} className="border-b">
                    {Array.from({ length: COLUMNS }).map((__, col) => (
                      <td key={col} className="px-4 py-2 text-center text-transparent select-none">
                        {/* invisible content keeps row height consistent */}
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={COLUMNS} className="px-4 py-8 text-center text-gray-500">
                  No customers found
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
// ...existing code...