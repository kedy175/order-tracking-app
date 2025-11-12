// app/order-status/[trackingToken]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ trackingToken: string }>;
}) {
  // ✅ unwrap params
  const { trackingToken } = await params;

  if (!trackingToken) notFound();

  const order = await prisma.order.findUnique({
    where: { tracking_token: trackingToken },
    include: { status: true, customer: true },
  });
  if (!order) notFound();

  const steps = [
    "Money received",
    "Purchased",
    "Dispatched",
    "In Transit",
    "In local country",
    "Delivered",
  ];
  const currentIndex = steps.indexOf(order.status.description);

  console.log(currentIndex)

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
