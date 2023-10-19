import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function GET(req: NextRequest) {
  try {
    const body = req.nextUrl.searchParams;
    const product = await prismadb.product.findMany();
    return new NextResponse(JSON.stringify(product));
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { productName, productDescription, cost, promoCode, subscription } =
      body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productName || !promoCode || !productDescription || cost <= 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const isPro = await checkSubscription();

    const insert_subscription = subscription ? true : false;
    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    const product = await prismadb.product.create({
      data: {
        productName: productName,
        productDescription: productDescription,
        cost: parseFloat(cost),
        subscription: insert_subscription,
        promoCode: parseInt(promoCode),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
