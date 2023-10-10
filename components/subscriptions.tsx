"use client";

import Image from "next/image";
import axios from "axios";
import { Category, Product, User, UserSubscription } from "@prisma/client";
import { Plus, PenSquare } from "lucide-react";
import { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, RadioGroup, Radio} from "@nextui-org/react";
import { Sparkles, ShoppingCart } from "lucide-react";
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

import ConfirmImg from "./../app/assets/img/confirm.png";
import CancelImg from "./../app/assets/img/cancel.png";

interface ProductsProps {
  subscription: UserSubscription[],
  user: User,
  category: Category,
  productList: Product[]
}
var apiParams:any = [];
// localStorage.clear();

export const Subscriptions = ({ subscription, user, productList, category }: ProductsProps) => { 
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
  const [subscriptionTypeValue, setSubscriptionTypeValue] = useState("oneMonth");
  const [subscriptionTypeLabel, setSubscriptionTypeLabel] = useState(category.oneMonth.toString());
  const [customSubscription, setcustomSubscription] = useState(false);
  const [isProductPurchase, setIsProductPurchase] = useState(true);
  const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);
  const [subscriptionParams, setSubscriptionParams] = useState("&params=" + category.oneMonth.toString() + "_oneMonth")
  var productSelected = false;

  const subscriptionProduct = (product: Product) =>  {
    setProduct(product)
    onOpen();
    setIsProductPurchase(false);

    apiParams = [product.id];
    
  }

  const onClick = async (type: string) => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe?type=" + type + "&productIds=" + JSON.stringify(apiParams) + subscriptionParams);

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

  const changeSubscriptionType = (value: string) => {
    setSubscriptionTypeValue(value);
    if(value == "custom") {
      setcustomSubscription(true);
      setSubscriptionTypeLabel(category.oneMonth.toString());
      setSubscriptionParams("&params=" + category.oneMonth.toString() + "_" + value);
    } else {
      setcustomSubscription(false);
      setSubscriptionTypeLabel(category[value].toString());
      setSubscriptionParams("&params=" + category[value].toString() + "_" + value)
    }
  }

  const changeSubscriptionMonth = (value: string) => {
    setSubscriptionTypeLabel((category.oneMonth * parseFloat(value)).toString());
  }

  const openProductModal = () => {
    setIsProductPurchase(true);
    setPurchaseTotalAmount(0);
    onOpen();
  }

  const selectedProduct = (isSelected: any) => {
    productSelected = isSelected;
    console.log(productSelected);
  }

  const getProductInfoFromId = (id: string, isSelected: boolean) => {
    return productList.find((item => item.id == id));
  }

  const productChanged = (productId:any) => {
    let productInfo = getProductInfoFromId(productId, !productSelected);
    let plusAmount = parseFloat(productInfo.cost);
    if(!productSelected) {
      plusAmount *= -1;
      apiParams.splice(apiParams.indexOf(productInfo.id), 1)
    } else {
      if(apiParams.indexOf(productInfo.id) == -1) {
        apiParams.push(productInfo.id);
      }
    }

    setSubscriptionParams("")

    setPurchaseTotalAmount(parseFloat(purchaseTotalAmount) + plusAmount);
  }
  return (
    <NextUIProvider>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size={"xl"} 
      >
        <ModalContent>
          {(onClose) => (
            isProductPurchase ? (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Purchase
              </ModalHeader>
              <ModalBody>
              <Table border={0}>
                <TableHeader>
                  <TableColumn>NO</TableColumn>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>Cost</TableColumn>
                  <TableColumn style={{ width: "8%", textAlign: "center" }}>
                    Subscription
                  </TableColumn>
                  <TableColumn> </TableColumn>
                </TableHeader>
                <TableBody>
                  {productList.map((item, key) => (
                    <TableRow key={`row_${key}`}>
                      <TableCell>{key + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.cost}$</TableCell>
                      <TableCell>
                        {item.subscription ? "Yes" : "No"}
                      </TableCell>

                      <TableCell style={{ textAlign: "center" }}>
                        <Checkbox radius="none" value={item.cost.toString()} onChange={() => productChanged(item.id)} onValueChange={selectedProduct}></Checkbox>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <p className="text-2xl font-medium">
                Total Amount: {purchaseTotalAmount}<span className="text-sm font-normal">$</span>
              </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" variant="solid" onClick={() => onClick("purchase")}>
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  Purchase
                </Button>
              </ModalFooter>
            </>
            ) : (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Subscription
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between">
                  <span className="text-2xl text-sky-500 font-medium">{product.productName}</span>
                  <p className="text-2xl font-medium">
                    ${subscriptionTypeLabel}<span className="text-sm font-normal"></span>
                  </p>
                </div>
                <RadioGroup
                  label="Select subscription type"
                  orientation="vertical"
                  value={subscriptionTypeValue}
                  onValueChange={ changeSubscriptionType }
                >
                  <Radio value={"oneMonth"}>One Month</Radio>
                  <Radio value={"threeMonth"}>Three Months</Radio>
                  <Radio value={"semiAnnual"}>Semi Annual</Radio>
                  <Radio value={"yearly"}>Yearly</Radio>
                  <Radio value={"MLSemiAnnual"}>ML Semi Annual</Radio>
                  <Radio value={"MLyearly"}>ML Yearly</Radio>
                  <Radio value="custom">Custom</Radio>
                </RadioGroup>
                {product.subscription == true && customSubscription &&
                  <Input
                    type="number"
                    label="Months"
                    placeholder="1"
                    labelPlacement="outside"
                    onValueChange={changeSubscriptionMonth}
                    endContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">Month</span>
                      </div>
                    }
                  />
                }
            
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="success" variant="solid" onClick={() => onClick("subscription")}>
                  <Sparkles className="w-4 h-4 ml-2" />
                  Subscribe
                </Button>
              </ModalFooter>
            </>
            )
          )}
        </ModalContent>
      </Modal>
      {subscription.length == 0 ? (
        <>
        <div className="pt-10 flex flex-col items-center justify-center space-y-3">
          <div className="relative w-60 h-60">
            <Image fill className="grayscale" src="/empty.png" alt="Empty" />
          </div>
          <p className="text-sm text-muted-foreground">No products found.</p>
          <Button
            onPress={() => openProductModal() }
          >
            <Plus className="mr-2" size={24} />
              Buy New
          </Button>
        </div>
      </>
      ) : (
        <>
        <div className="w-full overflow-x-auto ml-auto space-x-2 flex p-1">
        <Button
            onPress={() => openProductModal() }
            className="ml-auto mb-2"
          >
            <Plus className="mr-2 fill-white" size={24} />
              Buy New
        </Button>
      </div>
      <Table border={0}>
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Product</TableColumn>
          <TableColumn>Cost</TableColumn>
          <TableColumn>Expire Date</TableColumn>
          <TableColumn style={{ width: "8%", textAlign: "center" }}>
            Subscription
          </TableColumn>
          <TableColumn> </TableColumn>
        </TableHeader>
        <TableBody>
          {subscription.map((item:any, key:number) => (
            <TableRow key={`row_${key}`}>
              <TableCell>{key + 1}</TableCell>
              <TableCell>{item.product.productName}</TableCell>
              <TableCell>${item.product.cost}</TableCell>
              <TableCell>{!item.product.subscription ? "" : item.stripeCurrentPeriodEnd.toDateString()}</TableCell>
              <TableCell>
                <Image
                  src={item.product.subscription ? ConfirmImg : CancelImg}
                  className="rounded-sm object-cover mx-auto"
                  alt="Character"
                  height={20}
                />
              </TableCell>
              <TableCell style={{ textAlign: "center" }}>
                {item.product.subscription && 
                  <Button color="primary" variant="light" size="sm" onPress={() => subscriptionProduct(item.product)}>
                    <Plus />
                  </Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </>
      )} 
    </NextUIProvider>
  );
};
