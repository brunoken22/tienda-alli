"use client";
import { RecoilRoot } from "recoil";
import { Header } from "@/components/header";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

export default function LayoutRecoilRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <RecoilRoot>
      <Suspense>
        <Header />
        <div
          className={`${pathname.includes("/admin/dashboard") ? "" : "container"}  m-auto mt-24`}
        >
          {children}
        </div>
      </Suspense>
    </RecoilRoot>
  );
}
