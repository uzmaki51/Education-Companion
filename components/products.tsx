"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Plus, PenSquare } from "lucide-react";

import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  NextUIProvider,
} from "@nextui-org/react";
import ConfirmImg from "./../app/assets/img/confirm.png";
import CancelImg from "./../app/assets/img/cancel.png";

interface ProductsProps {
  data: Product[];
}

export const Products = ({ data }: ProductsProps) => {
  const router = useRouter();
  if (data.length === 0) {
    return (
      <>
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
            <Image fill className="grayscale" src="/empty.png" alt="Empty" />
          </div>
          <p className="text-sm text-muted-foreground">No products found.</p>
          <Button
            size="lg"
            variant={"premium"}
            onClick={() => router.push("/product/new")}
          >
            <Plus className="mr-2 fill-white" size={24} />
            Add New
          </Button>
        </div>
      </>
    );
  }

  return (
    <NextUIProvider>
      <div className="w-full overflow-x-auto space-x-2 flex p-1">
        <Button
          size="lg"
          variant={"premium"}
          onClick={() => router.push("/product/new")}
          style={{
            marginLeft: "auto",
          }}
        >
          <Plus className="mr-2 fill-white" size={24} />
          Add New
        </Button>
      </div>
      <Table border={0}>
        <TableHeader>
          <TableColumn>NO</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Cost</TableColumn>
          <TableColumn style={{ width: "8%", textAlign: "center" }}>
            Subscription
          </TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((item, key) => (
            <TableRow key={`row_${key}`}>
              <TableCell>{key + 1}</TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.productDescription}</TableCell>
              <TableCell>{item.cost}$</TableCell>
              <TableCell>
                <Image
                  src={item.subscription ? ConfirmImg : CancelImg}
                  className="rounded-sm object-cover mx-auto"
                  alt="Character"
                  height={20}
                />
              </TableCell>

              <TableCell style={{ textAlign: "center" }}>
                <Link href={`/product/${item.id}`}>
                  <PenSquare />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </NextUIProvider>
  );
};
