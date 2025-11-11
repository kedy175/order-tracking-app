// app/order-status/[orderToken]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { hashPhone } from "@/lib/hash";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderToken: string }>;
}) {
  // ✅ unwrap params
  const { orderToken } = await params;

  // ✅ safe parse
  const [idStr, hashPart] = (orderToken ?? "").split("-");
  const orderId = Number.parseInt(idStr, 10);
  if (!orderId || !hashPart) notFound();

  const order = await prisma.order.findUnique({
    where: { order_id: orderId },
    include: { status: true, customer: true },
  });
  if (!order) notFound();

  // ✅ verify hash matches phone
  const computed = hashPhone(order.customer.phone);
  if (computed !== hashPart) notFound();

  const steps = [
    "Money received",
    "Purchased",
    "Dispatched",
    "In Transit",
    "In local country",
    "Delivered",
  ];
  const currentIndex = steps.indexOf(order.status.description);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-8">Order #{order.order_id}</h1>

      <div className="flex flex-col items-center w-full max-w-md mb-8">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center w-full">
            <div
              className={`w-full text-center py-3 rounded-lg ${
                i <= currentIndex ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {i < steps.length - 1 && (
              <ArrowDown
                className={`my-2 ${i < currentIndex ? "text-blue-600" : "text-gray-400"}`}
                size={24}
              />
            )}
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
      >
        Track Another Parcel
      </Link>
    </main>
  );
}
