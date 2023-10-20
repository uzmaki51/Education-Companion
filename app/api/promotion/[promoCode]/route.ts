import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function GET(
  req: Request,
  { params }: { params: { promoCode: string } }
) {
  try {
    const product = await prismadb.promotion.findFirst({
      id: promoCode,
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
