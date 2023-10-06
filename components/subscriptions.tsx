"use client";

import Image from "next/image";
import axios from "axios";
import { Category, Product, User } from "@prisma/client";
import { Plus, PenSquare } from "lucide-react";
import { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
import { ProModal } from "./pro-modal";

interface ProductsProps {
  subscription: Product[],
  user: User
}


export const Subscriptions = ({ subscription, user }: Product) => { 
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState({
    id: "",
    productName: "",
    productDescription: "",
    cost: 0,
    promoCode: "",
    subscription: false
  });

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const subscriptionProduct = (product: Product) =>  {
    setProduct(product)
    onOpen();
  }

  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (subscription.length === 0) {
    return (
      <>
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
            <Image fill className="grayscale" src="/empty.png" alt="Empty" />
          </div>
          <p className="text-sm text-muted-foreground">No products found.</p>
          <Button
            size="lg"
            variant={"solid"}
            onClick={() => router.push("/product/new")}
          >
            <Plus className="mr-2 fill-white" size={24} />
            Buy New
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
          variant={"solid"}
          style={{
            margin: "auto",
          }}
          // onClick={() => openProModal()}
           color="primary"
        >
          <Plus className="mr-2 fill-white" size={24} />
          Buy New
        </Button>
      </div>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Subscription
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <span className="text-2xl text-sky-500 font-medium">{product.productName}</span>
                  <p className="text-2xl font-medium">
                    ${product.cost}<span className="text-sm font-normal">{product.subscription ? " / mo" : ""}</span>
                  </p>
                </div>
                {product.subscription == true &&
                  <Input
                    autoFocus
                    label="Months"
                    placeholder="Enter subscription months"
                    variant="bordered"
                    type="number"
                  />
                }

              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" variant="solid" onClick={onClick}>
                  <Sparkles className="w-4 h-4 ml-2 fill-white" />
                  Subscribe
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Table border={0}>
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Product</TableColumn>
          <TableColumn>Cost</TableColumn>
          <TableColumn>Expire Date</TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {initialData.subscription.map((item:any, key:number) => (
            <TableRow key={`row_${key}`}>
              <TableCell>{key + 1}</TableCell>
              <TableCell>{item.product.productName}</TableCell>
              <TableCell>{item.product.cost}</TableCell>
              <TableCell>{item.stripeCurrentPeriodEnd.toDateString()}</TableCell>
              <TableCell style={{ textAlign: "center" }}>
                <Button  onPress={() => subscriptionProduct(item.product)} color="primary">
                  <Plus />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </NextUIProvider>
  );
};
