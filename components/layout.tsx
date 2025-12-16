"use client";
import { Header } from "@/components/header";
import { usePathname } from "next/navigation";
import { ShoppingCartProvider } from "@/contexts/product-context";
import { Suspense } from "react";
import { Footer } from "./Footer";

export default function LayoutRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ShoppingCartProvider>
      <Header />
      <Suspense>
        <main
          className={`${
            pathname.includes("/admin/dashboard") ? "" : "max-w-screen-2xl "
          }  m-auto  bg-secondary rounded-tr-[30px]  py-2  `}
        >
          {children}
        </main>
      </Suspense>
      <Footer />
    </ShoppingCartProvider>
  );
}
