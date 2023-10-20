import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function GET(req: NextRequest) {
  try {
    const body = req.nextUrl.searchParams;
    const product = await prismadb.promotion.findMany();
    return new NextResponse(JSON.stringify(product));
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
