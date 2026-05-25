"use client";

import { SalesTab } from "@/components/sales-tab";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className='p-6  max-sm:p-2 space-y-8'>
      <div className='border-l-4 p-2 max-sm:border-0 max-sm:p-0 border-primary'>
        <h2 className='text-2xl font-bold text-primary mb-2'>Registro de Ventas</h2>
        <p className='text-muted-foreground mt-1'>
          {" "}
          Usa los botones - y + para registrar ventas o corregir errores
        </p>
      </div>

      <SalesTab />
      <Toaster position='bottom-right' richColors={true} />
    </main>
  );
}
