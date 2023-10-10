import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse, NextRequest } from "next/server";


import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { UserSubscription } from "@prisma/client";

const settingsUrl = absoluteUrl("/payments");

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    const body = req.nextUrl.searchParams;

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const productIdsTmp = body.get("productIds");
    const productIds:string[] = JSON.parse(productIdsTmp);

    var totalAmount = 0;

    let productList = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    })

    var insertData: any[] = [];
    productList.map((item, key) => {
      totalAmount += item.cost;
      insertData.push({
        userId: userId,
        productId: item.id,
        stripeSubscriptionId: "",
        stripeCustomerId: "",
        stripePriceId: "",
        stripeCurrentPeriodEnd: new Date(
          1699544776 * 1000 
        ),
      })
    })

    await prismadb.userSubscription.createMany({
      data: insertData
    })

    const userSubscription = await prismadb.userSubscription.findUnique({
      where: {
        userId
      }
    })

    // if (userSubscription && userSubscription.stripeCustomerId) {
    //   const stripeSession = await stripe.billingPortal.sessions.create({
    //     customer: userSubscription.stripeCustomerId,
    //     return_url: settingsUrl,
    //   })

    //   return new NextResponse(JSON.stringify({ url: stripeSession.url }))
    // }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      // customer: userId,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Companion Pro",
              description: "Create Custom AI Companions"
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    })

    return new NextResponse(JSON.stringify({ url: stripeSession.url }))
  } catch (error) {
    console.log("[STRIPE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
