import { auth, currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function GET(req: NextRequest) {
  try {
    const body = req.nextUrl.searchParams;
    const user = await prismadb.user.findFirst({
      where: {
        email: body["email"],
      },
    });
    return new NextResponse(JSON.stringify(user));
  } catch (error) {
    console.log("[COMPANION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, categoryId, email } = body;

    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!src || !name || !categoryId || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const isPro = await checkSubscription();

    // if (!isPro) {
    //   return new NextResponse("Pro subscription required", { status: 403 });
    // }

    const companion = await prismadb.user.create({
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        email,
        src,
        name,
        role: "user",
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
