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

    var totalAmount = 0;
    var insertData: any[] = [];

    const productIdsTmp = body.get("productIds");
    const productIds: string[] = JSON.parse(productIdsTmp);
    const type = body.get("type");

    if (type == "subscription") {
      const params = body.get("params");
      const price = params.split("_")[0];
      const period = params.split("_")[1];
      totalAmount = price;
      let timePeriod = 1;
      switch (period) {
        case "oneMonth":
          timePeriod = 1;
          break;
        case "threeMonth":
          timePeriod = 3;
          break;
        case "semiAnnual":
          timePeriod = 6;
          break;
        case "yearly":
          timePeriod = 12;
          break;
        case "MLSemiAnnual":
          timePeriod = 6;
          break;
        case "MLyearly":
          timePeriod = 12;
          break;
        default:
          timePeriod = period;
          totalAmount = period * price;
          break;
      }

      var userDBId = await prismadb.user.findFirst({
        where: {
          userId: userId
        }
      })

      userDBId = userDBId?.id;
      var nowTime = new Date();
      var periodTime = nowTime.setMonth(parseInt(nowTime.getMonth()) + parseInt(timePeriod));

      insertData = [
        {
          userId: userDBId,
          productId: productIds[0],
          stripeSubscriptionId: "",
          stripeCustomerId: "",
          stripePriceId: "",
          stripeCurrentPeriodEnd: new Date(periodTime),
        },
      ];
    } else {
      let productList = await prismadb.product.findMany({
        include: {
          promotion: true,
        },
        where: {
          id: {
            in: productIds,
          },
        },
      });

      productList.map((item, key) => {
        const cost =
          item.promotion.expiredAt < Date.now()
            ? item.cost
            : (item.cost * (100 - item.promotion.discount)) / 100;
        totalAmount += cost;
        insertData.push({
          userId: userDBId,
          productId: item.id,
          stripeSubscriptionId: "",
          stripeCustomerId: "",
          stripePriceId: "",
          stripeCurrentPeriodEnd: new Date(),
        });
      });
    }

    await prismadb.userSubscription.deleteMany({
      where: {
        userId: userDBId,
        purchaseStatus: 0,
      },
    });
    await prismadb.userSubscription.createMany({
      data: insertData,
    });

    // const userSubscription = await prismadb.userSubscription.findUnique({
    //   where: {
    //     userId
    //   }
    // })

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
              description: "Create Custom AI Companions",
            },
            unit_amount: totalAmount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userDBId,
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log("[STRIPE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
