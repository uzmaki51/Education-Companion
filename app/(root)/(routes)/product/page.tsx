import prismadb from "@/lib/prismadb";
import { Categories } from "@/components/categories";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/subscription";
import { Sidebar } from "@/components/sidebar";
import { Products } from "@/components/products";

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
      where: {
        email: user?.emailAddresses[0].emailAddress,
      },
    }));
  const data = await prismadb.user.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
      role: "user",
    },
  });

  if (userData && userData.role === "user") redirect("/payments");

  const categories = await prismadb.category.findMany();

  const isPro = await checkSubscription();

  return (
    <>
      <div className="md:flex mt-16 h-full w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} />
      </div>
      <main className="md:pl-20 pt-16 h-full">
        <div className="h-full p-4 space-y-2">
          <Products data={data} />
        </div>
      </main>
    </>
  );
};

export default RootPage;
