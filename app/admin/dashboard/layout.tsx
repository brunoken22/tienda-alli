"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthContext } from "@/contexts/auth-context";
import NavAdminMobile from "@/components/NavAdminMobile";
import Loading from "@/components/loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className='relative'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-primary/10 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className='grid md:grid-cols-[300px,1fr] lg:gap-0 max-lg:flex'>
        {/* Sidebar */}
        <aside
          className={`max-lg:hidden  relative w-full transform transition-transform duration-200   lg:col-span-1 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className='w-full bg-primaryLight text-secondary rounded-r-lg sticky h-[90dvh]  top-20 bottom-0 left-0 z-50'>
            <Sidebar />
          </div>
        </aside>

        {/* Slider mobile */}
        <div className='max-lg:block fixed bottom-2 left-2 right-2   bg-secondary text-black border-t  border-primary/50 rounded-xl  overflow-hidden hidden z-50 '>
          <NavAdminMobile />
        </div>

        {/* Main content */}
        <div className='w-full transition-all duration-200'>
          <div className=''>{children}</div>
        </div>
      </div>
    </div>
  );
}
