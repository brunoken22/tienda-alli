"use client";

import { LayoutDashboard, Package, LogOut, LockKeyhole, Logs, LayoutTemplate } from "lucide-react";
import { navItemsAdmin } from "./admin/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { logout } from "@/lib/serverAdmin";

export default function NavAdminMobile() {
  const { push } = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const response = await logout();
    if (response) push("/admin/login");
  };

  const icons = [
    <LayoutDashboard key='dashboard' className='w-4 h-4' />,
    <Package key='products' className='w-4 h-4' />,
    <Logs key='orders' className='w-4 h-4' />,
    <LayoutTemplate key='templates' className='w-4 h-4' />,
    <LockKeyhole key='security' className='w-4 h-4' />,
  ];

  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
      <div className='relative bg-white border-t shadow-sm'>
        {/* Burbuja flotante logout */}
        <div className='absolute -top-12 left-[90%]'>
          <Button
            onClick={handleLogout}
            className=' rounded-full shadow-md bg-red-500 text-white hover:bg-primary/90'
          >
            <LogOut className='w-4 h-4' />
          </Button>
        </div>

        {/* Navegación */}
        <div className='grid grid-cols-5 h-14 text-xs'>
          {navItemsAdmin.slice(0, 5).map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center justify-center gap-1 transition-colors
                  ${isActive ? "text-primary font-bold bg-secondary/20" : "hover:text-primary"}
                `}
              >
                {icons[index]}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
