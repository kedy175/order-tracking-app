import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// helper — deterministic hash
function hashPhone(phone: string) {
  // use a secret from your .env so others can’t forge hashes
  const secret = process.env.HASH_SECRET || "default_secret_key";
  return crypto.createHmac("sha256", secret).update(phone).digest("hex").slice(0, 12);
}

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

    // generate hashed phone for URL
    const hashedPhone = hashPhone(phone);
    const orderToken = `${order.order_id}-${hashedPhone}`;
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
