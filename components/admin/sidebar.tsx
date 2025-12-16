"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, LogOut, UserCircle, LockKeyhole, Logs } from "lucide-react";
import { AuthContext } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/serverAdmin";
import { useContext } from "react";

export const navItemsAdmin = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Productos",
    href: "/admin/dashboard/productos",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/admin/dashboard/categorias",
    icon: Logs,
  },
  {
    title: "Contraseña",
    href: "/admin/dashboard/cambiar-contrasena",
    icon: LockKeyhole,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { push } = useRouter();
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    const response = await logout();
    if (response) {
      push("/admin/login");
    }
  };

  return (
    <div className='flex flex-col h-full bg-card border-r border-border'>
      <div className='p-6 border-b border-border'>
        <div className='flex items-center gap-2'>
          <div>
            <UserCircle className='w-8 h-8' />
          </div>
          <div>
            <h2 className='font-semibold text-foreground'>{user?.name}</h2>
            <p className='text-xs text-muted-foreground'>Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-2'>
        {navItemsAdmin.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={` flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                ${
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-primary"
                }`}
            >
              <Icon className='w-5 h-5' />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className='p-4 border-t border-border'>
        <div className='mb-3 px-3'>
          <p className='text-sm font-medium text-foreground'>{user?.name}</p>
          <p className='text-xs text-muted-foreground'>{user?.email}</p>
        </div>
        <Button onClick={handleLogout} variant='secondary' className='w-full hover:opacity-80'>
          <LogOut className='w-4 h-4' />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
