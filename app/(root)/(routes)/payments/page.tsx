import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/subscription";
import { Sidebar } from "@/components/sidebar";
import { Subscriptions } from "@/components/subscriptions";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  const user = await currentUser();
  const userData =
    user &&
    (await prismadb.user.findFirst({
      include: {
        category: true,
      },
      where: {
        email: user?.emailAddresses[0].emailAddress,
      },
    }));

  const userSubscription = await prismadb.userSubscription.findMany({
    include: {
      product: true,
    },
    where: {
      AND: [
        {
          userId: userData?.id,
        },
        {
          purchaseStatus: 1,
        },
      ],
    },
  });

  const product = await prismadb.product.findMany({
    include: {
      promotion: true,
    },
  });
  console.log(product)

  return (
    <>
      <main className="pt-16 h-full">
        <div className="h-full p-4 space-y-2">
          <Subscriptions
            subscription={userSubscription}
            user={userData}
            productList={product}
            category={userData?.category}
          />
        </div>
      </main>
    </>
  );
};

export default RootPage;
