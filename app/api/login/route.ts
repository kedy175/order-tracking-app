import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // ✅ correct import

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json();
    console.log("Loggin user:", phone);

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
        where: { phone },  // ✅ must use 'where'
        select: {
            customer_id: true,
            phone: true,
            first_name: true,
            last_name: true,
            password_hash: true, // include this if you need to compare passwords
        },
    });

    if (!customer) {
        return NextResponse.json(
            { success: false, message: "User Not Found" },
            { status: 500 }
        );
    }

    const valid = await bcrypt.compare(password, customer.password_hash);

    if (!valid) {
        return NextResponse.json(
            { success: false, message: "User Not Found" },
            { status: 500 }
        );
    }

    const { password_hash, ...customerWithoutPassword } = customer;

    return NextResponse.json({ success: true, customer: customerWithoutPassword });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
