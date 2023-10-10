import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session
  var userId = "";

  if (event.type === "checkout.session.completed") {
    let parsedBody = JSON.parse(body)
    console.log(parsedBody.data)
    userId = parsedBody.data.object.metadata.userId;
  // }

  // if (event.type === "payment_intent.created") {
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    console.log("webhook callback User Id------------------", userId);

    await prismadb.userSubscription.updateMany({
      where: {
        userId: userId,
        purchaseStatus: 0
      },
      data: {
        purchaseStatus: 1
      },
    })
  }

  // if (event.type === "invoice.payment_succeeded") {
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string
  //   )

  //   await prismadb.userSubscription.update({
  //     where: {
  //       stripeSubscriptionId: subscription.id,
  //     },
  //     data: {
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000
  //       ),
  //     },
  //   })
  // }

  return new NextResponse(null, { status: 200 })
};
