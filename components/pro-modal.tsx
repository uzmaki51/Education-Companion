"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@prisma/client";
interface PaymentProps {
  onOpen: boolean,
  product: Product
}

export const ProModal = ({ onOpen, product }: PaymentProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // console.log(isOpen)
  // if(onOpen) {
  //   // setIsOpen(true);
  //   setIsOpen(true);
  // }
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubscribe = async () => {
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
  }

  if (!isMounted) {
    return null;
  }

  const a = () => {
    onOpen = false;
    
    // setOpen(false);
  }

  return (
    <Dialog open={onOpen} onOpenChange={() => a()}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            Subscription
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            Create
            <span className="text-sky-500 mx-1 font-medium">{}</span>
            Companions!
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className="text-2xl font-medium">
            $9<span className="text-sm font-normal">.99 / mo</span>
          </p>
          <Button onClick={onSubscribe} disabled={loading} variant="premium">
            Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
