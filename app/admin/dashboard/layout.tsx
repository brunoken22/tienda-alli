"use client";

import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthContext } from "@/contexts/auth-context";

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
    return (
      <div className='flex items-center justify-center '>
        <div className='text-muted-foreground'>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // console.log(sidebarOpen);

  return (
    <div className='relative'>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-primary/10 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className='grid md:grid-cols-[256px,1fr] lg:gap-0 max-lg:flex'>
        {/* Sidebar */}
        <aside
          className={`bg-primaryLight text-secondary rounded-tr-lg fixed top-28 bottom-0 left-0 z-50 w-64 transform transition-transform duration-200   lg:col-span-1 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </aside>

        {/* Main content */}
        <div className='max-lg:w-full lg:col-span-1 lg:col-start-2 transition-all duration-200'>
          <div className=''>{children}</div>
        </div>
      </div>
    </div>
  );
}
