import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className='min-h-[50dvh] inset-0 bg-background flex items-center justify-center z-50'>
      <div className='flex flex-col items-center gap-4'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
        <p className='text-xl font-medium text-foreground'>Cargando...</p>
      </div>
    </div>
  );
}
