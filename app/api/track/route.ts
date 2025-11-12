import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderId, phone } = await req.json();

    // validate input
    const id = parseInt(orderId, 10);
    if (Number.isNaN(id) || !phone) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    // find order that matches both order id and customer phone
    const order = await prisma.order.findFirst({
      where: {
        order_id: id,
        customer: { phone },
      },
      include: { status: true, customer: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    
    const orderToken = `${order.tracking_token}`;
    // send redirect URL back to client
    return NextResponse.json({
      success: true,
      message: "Order found",
      redirect: `/order-status/${orderToken}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
