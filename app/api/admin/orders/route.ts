import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if your prisma client lives elsewhere

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { order_id: "desc" }, // newest first
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
            phone: true, // you can remove this if you don't want to expose phone numbers
          },
        },
        status: {
          select: {
            description: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
