"use client";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";
import { ShoppingCartProvider } from "@/contexts/product-context";
import { Suspense } from "react";

export default function LayoutRecoilRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ShoppingCartProvider>
      <Header />
      <Suspense>
        <div
          className={`${
            pathname.includes("/admin/dashboard") ? "" : "container"
          }  m-auto  bg-secondary rounded-tr-[30px]  pt-2`}
        >
          {children}
        </div>
      </Suspense>
    </ShoppingCartProvider>
  );
}
