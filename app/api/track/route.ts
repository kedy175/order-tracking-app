import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();
  const { orderId } = data;

  console.log("Received orderId:", orderId);
  // Process orderId here
  return NextResponse.json({ message: `Tracking ${orderId}` });
}