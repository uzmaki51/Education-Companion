import { Navbar } from "@/components/navbar";
import { checkSubscription } from "@/lib/subscription";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const isPro = await checkSubscription();

  return (
    <div className="mh-full">
      <Navbar isPro={isPro} />
      {children}
    </div>
  );
};

export default RootLayout;
