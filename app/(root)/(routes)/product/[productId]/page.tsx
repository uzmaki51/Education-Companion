import { redirect } from "next/navigation";
import { auth, redirectToSignIn } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

import { ProductForm } from "./components/product-form";
import { Sidebar } from "@/components/sidebar";

interface ProductIdPageProps {
  params: {
    productId: string;
  };
}

const ProductIdPage = async ({ params }: ProductIdPageProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const companion =
    params.productId === "new"
      ? null
      : await prismadb.product.findUnique({
          where: {
            id: params.productId,
          },
        });

  const categories = await prismadb.category.findMany();

  const isPro = await checkSubscription();

  return (
    <>
      <div className="hidden md:flex mt-16 h-full w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={isPro} />
      </div>
      <main className="md:pl-20 pt-16 h-full">
        <ProductForm initialData={companion} categories={categories} />
      </main>
    </>
  );
};

export default ProductIdPage;
