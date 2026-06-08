"use client";

import { useEffect, useState } from "react";
import { InventoryType } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  RotateCcw,
  ShoppingCart,
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Settings2,
  Percent,
  FileText,
} from "lucide-react";
import { getInventoryMovements } from "@/lib/inventory";
import { toast } from "sonner";

const movementTypeConfig: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  SALE: {
    label: "Venta",
    icon: ShoppingCart,
    bgColor: "bg-rose-50 ",
    textColor: "text-rose-600 ",
    borderColor: "border-rose-200 ",
  },
  RETURN: {
    label: "Devolución",
    icon: RotateCcw,
    bgColor: "bg-blue-50 ",
    textColor: "text-blue-600 ",
    borderColor: "border-blue-200 ",
  },
  PURCHASE: {
    label: "Compra",
    icon: ArrowDownCircle,
    bgColor: "bg-emerald-50 ",
    textColor: "text-emerald-600 ",
    borderColor: "border-emerald-200 ",
  },
  DAMAGED: {
    label: "Dañado",
    icon: Trash2,
    bgColor: "bg-amber-50 ",
    textColor: "text-amber-600 ",
    borderColor: "border-amber-200 ",
  },
  ADJUSTMENT: {
    label: "Ajuste",
    icon: Settings2,
    bgColor: "bg-violet-50 ",
    textColor: "text-violet-600 ",
    borderColor: "border-violet-200 ",
  },
};

export default function LatestMoves() {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<InventoryType | null>(null);
  const [history, setHistory] = useState<InventoryType[]>([]);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [isLoading, setIsLoading] = useState(true);

  async function loadHistory(pageNumber = page) {
    setIsLoading(true);

    try {
      const response = await getInventoryMovements({
        page: pageNumber,
        limit,
      });
      setHistory(response.data);
      setPagination(response.pagination);
    } catch {
      toast.error("Error al cargar historial");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadHistory(page);
  }, [page]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;

    return new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  };
  return (
    <>
      <Card className='order-1 lg:order-2'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <History className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground' />
              Últimos Movimientos
            </CardTitle>
            <Button variant='ghost' size='sm' onClick={() => loadHistory()} className='h-8 w-8 p-0'>
              <RotateCcw className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className='animate-pulse flex items-center gap-3 p-3 rounded-xl bg-muted/50'
                >
                  <div className='h-12 w-12 rounded-xl bg-muted shrink-0' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-muted rounded w-3/4' />
                    <div className='h-3 bg-muted rounded w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
              <History className='h-10 w-10 mb-2 opacity-50' />
              <p className='text-sm'>Sin movimientos recientes</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
              {history.map((movement) => {
                const config = movementTypeConfig[movement.type];
                const Icon = config.icon;
                const isNegative = movement.type === "SALE" || movement.type === "DAMAGED";
                const hasDiscount = movement.note?.includes("Descuento:");
                const hasNote = movement.note && !movement.note.startsWith("Descuento:");

                return (
                  <div
                    key={movement.id}
                    className={`flex flex-col gap-2 p-3 rounded-xl border-2 transition-all ${config.bgColor} ${config.borderColor}`}
                  >
                    <div className='flex items-start gap-3'>
                      <div
                        className={`flex items-center justify-center h-12 w-12 rounded-xl shrink-0 bg-white dark:bg-gray-900 shadow-sm ${config.textColor}`}
                      >
                        <Icon className='h-6 w-6' />
                      </div>

                      <div className='flex-1 min-w-0 space-y-1'>
                        <div className='flex items-center gap-2'>
                          <span
                            className={`text-xs font-bold uppercase tracking-wide ${config.textColor}`}
                          >
                            {config.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 text-sm font-bold ${isNegative ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}
                          >
                            {isNegative ? (
                              <ArrowDownCircle className='h-3.5 w-3.5' />
                            ) : (
                              <ArrowUpCircle className='h-3.5 w-3.5' />
                            )}
                            {movement.quantity}
                          </span>
                        </div>

                        <p className='font-medium text-sm leading-tight line-clamp-1 text-foreground'>
                          {movement.product?.title || "Producto"}
                        </p>

                        {movement.variant && (
                          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                            <span
                              className='h-3 w-3 rounded-full ring-1 ring-border shrink-0'
                              style={{ backgroundColor: movement.variant.colorHex }}
                            />
                            <span className='truncate'>
                              {movement.variant.size} - {movement.variant.colorName}
                            </span>
                          </div>
                        )}

                        <div className='flex items-center justify-between text-xs text-muted-foreground pt-1'>
                          <span>{formatDate(movement.createdAt)}</span>
                          <span className='font-mono bg-muted/80 px-1.5 py-0.5 rounded'>
                            {movement.previousStock} → {movement.newStock}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(hasDiscount || hasNote) && (
                      <div className='flex flex-wrap gap-1.5 pt-1 border-t border-current/10'>
                        {hasDiscount && (
                          <span className='inline-flex items-center gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full'>
                            <Percent className='h-3 w-3' />
                            Descuento
                          </span>
                        )}
                        {movement.note && (
                          <button
                            type='button'
                            onClick={() => {
                              setSelectedMovement(movement);
                              setNoteModalOpen(true);
                            }}
                            className='inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full hover:bg-blue-200 transition-colors'
                          >
                            <FileText className='h-3 w-3' />
                            Nota
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {pagination.totalPages > 1 && (
          <div className='flex items-center justify-between px-6 pb-6 border-t pt-4'>
            <div className='text-sm text-muted-foreground'>
              Mostrando {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.total)} de{" "}
              {pagination.total} movimientos
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePrevPage}
                disabled={!pagination.hasPrevPage}
              >
                Anterior
              </Button>

              <span className='text-sm font-medium'>
                Página {pagination.page} de {pagination.totalPages}
              </span>

              <Button
                variant='outline'
                size='sm'
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
      <Dialog
        open={noteModalOpen}
        onOpenChange={(open) => {
          setNoteModalOpen(open);

          if (!open) {
            setSelectedMovement(null);
          }
        }}
      >
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>Detalle de la nota</DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Producto</p>
              <p className='font-medium'>{selectedMovement?.product?.title || "Producto"}</p>
            </div>

            {selectedMovement?.variant && (
              <div>
                <p className='text-sm text-muted-foreground'>Variante</p>
                <div className='flex items-center gap-2'>
                  <span
                    className='h-4 w-4 rounded-full border'
                    style={{
                      backgroundColor: selectedMovement.variant.colorHex,
                    }}
                  />
                  <span>
                    {selectedMovement.variant.size} - {selectedMovement.variant.colorName}
                  </span>
                </div>
              </div>
            )}

            <div>
              <p className='text-sm text-muted-foreground mb-2'>Nota</p>

              <div className='rounded-lg border bg-muted/30 p-4 whitespace-pre-wrap break-words'>
                {selectedMovement?.note || "Sin nota"}
              </div>
            </div>

            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <span>Tipo</span>
              <Badge variant='outline'>
                {movementTypeConfig[selectedMovement?.type || "SALE"]?.label}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
