import Image from "next/image";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

const RootPage = async ({ searchParams }: RootPageProps) => {
  return (
    <div className="pt-10 flex flex-col items-center justify-center space-y-3">
      <div className="relative w-60 h-60">
        <Image fill className="grayscale" src="/empty.png" alt="Empty" />
      </div>
      <p className="text-sm text-muted-foreground">Not Allowed User</p>
    </div>
  );
};

export default RootPage;
