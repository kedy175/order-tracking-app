import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust if your prisma client lives elsewhere

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          select: {
            order_id: true,
            price: true,
            purchase_date: true,
          },
        },
      },
      orderBy: { customer_id: "asc" },
    });

    
    return NextResponse.json({ success: true, customers });
  } catch (err) {
    console.error("GET /api/admin/customers error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}