"use client";

import { SalesTab } from "@/components/sales-tab";
import { SalesAnalytics } from "@/components/sales-analytics";
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <main className='min-h-screen bg-background'>
      <div className='border-b bg-card'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-xl font-semibold tracking-tight'>Sistema POS</h1>
              <p className='text-sm text-muted-foreground'>Gestión de ventas e inventario</p>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='analytics' className='space-y-6'>
          <TabsList className='grid w-full max-w-md grid-cols-2'>
            <TabsTrigger value='analytics' className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4' />
              <span className='hidden sm:inline'>Analíticas</span>
            </TabsTrigger>
            <TabsTrigger value='sales' className='flex items-center gap-2'>
              <ShoppingCart className='h-4 w-4' />
              <span className='hidden sm:inline'>Ventas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='analytics' className='space-y-4'>
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value='sales' className='space-y-4'>
            <SalesTab />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster position='bottom-right' richColors />
    </main>
  );
}
