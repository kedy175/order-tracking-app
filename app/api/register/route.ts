import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // ✅ correct import

export async function POST(req: Request) {
  try {
    const { phone, password, first_name, last_name } = await req.json();
    console.log("Registering user:", phone, first_name, last_name);
    // Basic validation
    if (!phone || !password || !first_name || !last_name) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password too short" },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existing = await prisma.customer.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Phone already registered" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: { phone, first_name, last_name, password_hash },
      select: {
        customer_id: true,
        phone: true,
        first_name: true,
        last_name: true,
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
