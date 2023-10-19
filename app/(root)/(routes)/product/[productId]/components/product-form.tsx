"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Product, Promotion } from "@prisma/client";

import { NextUIProvider } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";

const formSchema = z.object({
  productName: z.string().min(1, {
    message: "Name is required.",
  }),
  productDescription: z.string().min(1, {
    message: "Description is required.",
  }),
  cost: z.coerce.number(),
  promoCode: z.string().min(1, {
    message: "Promotion Code is required",
  }),
  subscription: z.boolean(),
});

interface ProductFormProps {
  initialData: Product | null;
}

export const ProductForm = ({ initialData }: ProductFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [promoData, setPromoData] = useState<Promotion[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      productName: "",
      productDescription: "",
      cost: 0,
      promoCode: "",
      subscription: false,
    },
  });

  const getPromotions = async () => {
    const res = await axios.get("/api/promotion");
    setPromoData(res.data);
  };

  useEffect(() => {
    getPromotions();
  }, []);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await axios.patch(`/api/product/${initialData.id}`, values);
      } else {
        await axios.post("/api/product", values);
      }

      toast({
        description: "Success.",
        duration: 3000,
      });

      router.refresh();
      router.push("/product");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  };

  return (
    <NextUIProvider>
      <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-10"
          >
            <div className="space-y-2 w-full col-span-2">
              <div>
                <h3 className="text-lg font-medium">Product Information</h3>
                <p className="text-sm text-muted-foreground">
                  Please upload product
                </p>
              </div>
              <Separator className="bg-primary/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="productName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Environment lecture"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <FormField
                name="productDescription"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Please input the description of product"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="cost"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isLoading}
                        placeholder="10,000$"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="subscription"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem
                      className="col-span-2 md:col-span-1"
                      style={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <FormLabel>Subscription</FormLabel>
                      <FormControl
                        style={{
                          marginTop: 0,
                          marginLeft: 30,
                        }}
                      >
                        <Switch
                          color="success"
                          style={{ width: "11%" }}
                          {...field}
                          isSelected={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion Code</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {promoData.map((item, index) => (
                          <SelectItem
                            key={`promo_${index}`}
                            value={item.id.toString()}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-center">
              <Button size="lg" disabled={isLoading}>
                {initialData ? "Save" : "Create Product"}
                <Wand2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </NextUIProvider>
  );
};
