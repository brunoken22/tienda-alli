import { LayoutDashboard, Package, LogOut, LockKeyhole, Logs } from "lucide-react";
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
    if (response) {
      push("/admin/login");
    }
  };
  return (
    <div className='grid grid-cols-5  items-center justify-center'>
      <Link
        href={navItemsAdmin[0].href}
        className={` flex flex-col items-center justify-center gap-1 px-2 py-3 h-full  text-sm max-sm:text-[11px]  font-medium transition-colors",
                ${
                  pathname === navItemsAdmin[0].href
                    ? "bg-primary/90 text-secondary"
                    : "text-muted-foreground hover:bg-primary/90 hover:text-secondary"
                }`}
      >
        <LayoutDashboard className='w-4 h-4' />
        {navItemsAdmin[0].title}
      </Link>
      <Link
        href={navItemsAdmin[1].href}
        className={` flex flex-col items-center justify-center gap-1 px-2 py-3 h-full  text-sm max-sm:text-[11px]  font-medium transition-colors",
                ${
                  pathname === navItemsAdmin[1].href
                    ? "bg-primary/90 text-secondary"
                    : "text-muted-foreground hover:bg-primary/90 hover:text-secondary"
                }`}
      >
        <Package className='w-4 h-4' />
        {navItemsAdmin[1].title}
      </Link>
      <div className='flex justify-center'>
        <Button
          onClick={handleLogout}
          className={`w-12 h-12 flex justify-center items-center p-5  bg-primary text-secondary hover:bg-primary/50  !rounded-full  transition-colors`}
        >
          <LogOut className='w-4 h-4' />
        </Button>
      </div>
      <Link
        href={navItemsAdmin[2].href}
        className={` flex flex-col items-center justify-center gap-1 px-2 py-3 h-full  text-sm max-sm:text-[11px]  font-medium transition-colors",
                ${
                  pathname === navItemsAdmin[2].href
                    ? "bg-primary/90 text-secondary"
                    : "text-muted-foreground hover:bg-primary/90 hover:text-secondary"
                }`}
      >
        <Logs className='w-4 h-4' />
        {navItemsAdmin[2].title}
      </Link>
      <Link
        href={navItemsAdmin[3].href}
        className={` flex flex-col items-center justify-center gap-1 px-2 py-3 h-full  text-sm max-sm:text-[11px]  font-medium transition-colors",
                ${
                  pathname === navItemsAdmin[3].href
                    ? "bg-primary/90 text-secondary"
                    : "text-muted-foreground hover:bg-primary/90 hover:text-secondary"
                }`}
      >
        <LockKeyhole className='w-4 h-4' />
        {navItemsAdmin[3].title}
      </Link>
    </div>
  );
}
