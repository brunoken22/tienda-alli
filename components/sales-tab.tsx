"use client";

import { useEffect, useState } from "react";
import { ProductType, VariantType } from "@/types/product";
import { InventoryType, InventoryMovementType } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Package,
  AlertTriangle,
  RotateCcw,
  ShoppingCart,
  History,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
  Settings2,
  ImageOff,
  Percent,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { createInventoryMovement, getInventoryMovements } from "@/lib/inventory";
import { getProducts } from "@/lib/products";
import { StockMovementModal, StockMovementData } from "@/components/stock-movement-modal";

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

export function SalesTab() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
  const [history, setHistory] = useState<InventoryType[]>([]);
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [products, setProducts] = useState<{
    data: ProductType[];
    isLoading: boolean;
    totalPrice: number;
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>({
    data: [],
    totalPrice: 0,
    isLoading: true,
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    (async () => {
      setProducts((prev) => ({ ...prev, isLoading: true }));

      const queryParams: any = {
        page,
        limit,
        sortBy: "title",
        sortOrder: "asc",
      };

      const response = await getProducts(queryParams);

      if (response.success) {
        setProducts({
          isLoading: false,
          data: response.data,
          pagination: response.pagination,
          totalPrice: response.totalPrice,
        });
      } else {
        setProducts({
          isLoading: false,
          totalPrice: 0,
          data: [],
        });
      }
    })();
  }, [page, limit]);

  const handleNextPage = () => {
    if (products.pagination?.hasNextPage) setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleUpdateStock = (productId: string, variantId: string | null, newStock: number) => {
    setProducts((prevProducts) => ({
      ...prevProducts,
      data: prevProducts.data.map((product) => {
        if (product.id !== productId) return product;

        if (variantId) {
          return {
            ...product,
            variants: product.variants.map((variant) =>
              variant.id === variantId ? { ...variant, stock: newStock } : variant,
            ),
          };
        }

        return { ...product, stock: newStock };
      }),
    }));
  };

  async function loadHistory() {
    setIsLoading(true);
    try {
      const movements = await getInventoryMovements();
      setHistory(movements);
    } catch {
      toast.error("Error al cargar historial");
    } finally {
      setIsLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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

  const handleProductClick = (product: ProductType) => {
    if (product.variants.length > 0) {
      setSelectedProduct(product);
      setVariantDialogOpen(true);
    }
  };

  const handleOpenMovementModal = (product: ProductType, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProduct(product);
    setSelectedVariant(null);
    setMovementModalOpen(true);
  };

  const handleOpenVariantMovementModal = (variant: VariantType) => {
    console.log("variant", variant);
    console.log("selectedProduct", selectedProduct);

    setSelectedVariant(variant);
    setMovementModalOpen(true);
  };

  const buildMovementNote = (data: StockMovementData): string => {
    const parts: string[] = [];

    if (data.hasDiscount && data.discountValue > 0) {
      if (data.discountType === "percentage") {
        parts.push(`Descuento: ${data.discountValue}%`);
      } else {
        parts.push(`Descuento: $${data.discountValue.toFixed(2)}`);
      }
      parts.push(`Precio final: $${data.finalPrice.toFixed(2)}`);
    }

    if (data.note) {
      parts.push(data.note);
    }

    return parts.join(" | ") || "";
  };

  const handleMovementConfirm = async (data: StockMovementData) => {
    if (!selectedProduct) return;

    const isOutput = ["SALE", "DAMAGED", "ADJUSTMENT"].includes(data.type);
    const stockChange = isOutput ? -data.quantity : data.quantity;

    try {
      if (selectedVariant) {
        const newStock = selectedVariant.stock + stockChange;

        if (newStock < 0) {
          toast.error("Stock insuficiente");
          return;
        }

        await createInventoryMovement({
          variantId: selectedVariant.id,
          type: data.type.toUpperCase() as InventoryMovementType,
          quantity: data.quantity,
          note: buildMovementNote(data),
        });

        handleUpdateStock(selectedProduct.id, selectedVariant.id, newStock);

        setSelectedProduct({
          ...selectedProduct,
          variants: selectedProduct.variants.map((v) =>
            v.id === selectedVariant.id ? { ...v, stock: newStock } : v,
          ),
        });
      } else {
        const newStock = selectedProduct.stock + stockChange;

        if (newStock < 0) {
          toast.error("Stock insuficiente");
          return;
        }

        await createInventoryMovement({
          // productId: selectedProduct.id,
          type: data.type.toUpperCase() as InventoryMovementType,
          quantity: data.quantity,
          note: buildMovementNote(data),
        });

        handleUpdateStock(selectedProduct.id, null, newStock);
      }

      const typeLabels: Record<string, string> = {
        sale: "Venta registrada",
        purchase: "Compra registrada",
        return: "Devolución registrada",
        damaged: "Producto dañado registrado",
        adjustment: "Ajuste registrado",
      };

      toast.success(typeLabels[data.type] || "Movimiento registrado");
      loadHistory();
      setSelectedVariant(null);
    } catch {
      toast.error("Error al registrar movimiento");
    }
  };

  const getModalProduct = () => {
    if (!selectedProduct) return null;

    if (selectedVariant) {
      return {
        id: selectedVariant.id,
        title: `${selectedProduct.title} - ${selectedVariant.size} ${selectedVariant.colorName}`,
        price: Number(selectedVariant.priceOffer) || Number(selectedVariant.price),
        stock: selectedVariant.stock,
        images: selectedProduct.images,
      };
    }

    return {
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: Number(selectedProduct.priceOffer) || Number(selectedProduct.price),
      stock: selectedProduct.stock,
      images: selectedProduct.images,
    };
  };

  const activeProducts = products.data.filter((p) => p.isActive);

  return (
    <div className='flex flex-col gap-4 lg:gap-6'>
      {/* Historial de movimientos */}
      <Card className='order-1 lg:order-2'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <History className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground' />
              Últimos Movimientos
            </CardTitle>
            <Button variant='ghost' size='sm' onClick={loadHistory} className='h-8 w-8 p-0'>
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
              {history.slice(0, 8).map((movement) => {
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
                          <span className='inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full'>
                            <FileText className='h-3 w-3' />
                            Nota
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Productos */}
      <Card className='order-2 lg:order-1'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
              <Package className='h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground' />
              Productos Activos
            </CardTitle>
            <Badge variant='secondary' className='font-mono text-xs'>
              {activeProducts.length} items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          {products.isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
              {[...Array(8)].map((_, i) => (
                <div key={i} className='animate-pulse rounded-xl border bg-muted/50 p-3 space-y-3'>
                  <div className='aspect-square rounded-lg bg-muted' />
                  <div className='h-4 bg-muted rounded w-3/4' />
                  <div className='h-3 bg-muted rounded w-1/2' />
                </div>
              ))}
            </div>
          ) : activeProducts.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
              <Package className='h-12 w-12 mb-3 opacity-50' />
              <p className='font-medium'>No hay productos activos</p>
              <p className='text-sm'>Activa productos para comenzar a vender</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
              {activeProducts.map((product) => {
                const hasVariants = product.variants.length > 0;
                const totalStock = hasVariants
                  ? product.variants.reduce((acc, v) => acc + v.stock, 0)
                  : product.stock;
                const isOutOfStock = totalStock === 0;
                const isLowStock = totalStock > 0 && totalStock <= 5;

                return (
                  <div
                    key={product.id}
                    className={`group relative flex flex-col p-3 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/20 ${isOutOfStock ? "opacity-60" : ""}`}
                  >
                    <div className='relative aspect-square rounded-lg overflow-hidden bg-muted mb-3'>
                      {product.images?.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.title}
                          fill
                          className='object-cover transition-transform group-hover:scale-105'
                        />
                      ) : (
                        <div className='flex items-center justify-center h-full'>
                          <ImageOff className='h-8 w-8 text-muted-foreground/50' />
                        </div>
                      )}

                      <div className='absolute top-2 right-2'>
                        <Badge
                          variant={
                            isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"
                          }
                          className='font-mono text-xs shadow-md'
                        >
                          {isOutOfStock ? "Sin stock" : `Stock: ${totalStock}`}
                        </Badge>
                      </div>

                      {isLowStock && !isOutOfStock && (
                        <div className='absolute top-2 left-2'>
                          <div className='flex items-center gap-1 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow-md'>
                            <AlertTriangle className='h-3 w-3' />
                            Bajo
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='flex-1 space-y-1 mb-3'>
                      <h3 className='font-semibold text-sm leading-tight line-clamp-2'>
                        {product.title}
                      </h3>

                      <div className='flex items-baseline gap-2'>
                        <span className='font-bold text-base'>
                          {formatPrice(product.priceOffer || product.price)}
                        </span>
                      </div>
                    </div>

                    {hasVariants ? (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleProductClick(product)}
                        className='w-full'
                      >
                        <Package className='h-4 w-4 mr-2' />
                        {product.variants.length} variantes
                      </Button>
                    ) : (
                      <Button
                        variant='default'
                        size='sm'
                        className='w-full'
                        onClick={(e) => handleOpenMovementModal(product, e)}
                      >
                        <Settings2 className='h-4 w-4 mr-1.5' />
                        Gestionar Stock
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {products.pagination && products.pagination.totalPages > 1 && (
        <div className='flex items-center justify-between border-t pt-4'>
          <div className='text-sm text-muted-foreground'>
            Mostrando {(page - 1) * limit + 1} - {Math.min(page * limit, products.pagination.total)}{" "}
            de {products.pagination.total} productos
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={handlePrevPage}
              disabled={!products.pagination.hasPrevPage}
            >
              Anterior
            </Button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: Math.min(5, products.pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (products.pagination!.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= products.pagination!.totalPages - 2) {
                  pageNum = products.pagination!.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size='sm'
                    onClick={() => setPage(pageNum)}
                    className='w-8 h-8 p-0'
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {products.pagination.totalPages > 5 && <span className='px-2'>...</span>}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleNextPage}
              disabled={!products.pagination.hasNextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Dialog para seleccionar variantes */}
      <Dialog open={variantDialogOpen} onOpenChange={setVariantDialogOpen}>
        <DialogContent className='max-w-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col p-0'>
          <DialogHeader className='shrink-0 p-4 sm:p-6 pb-0'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-muted ring-1 ring-border'>
                {selectedProduct?.images && selectedProduct.images.length > 0 ? (
                  <Image
                    src={selectedProduct.images[0]}
                    alt={selectedProduct.title}
                    fill
                    className='object-cover'
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <ImageOff className='h-6 w-6 text-muted-foreground/50' />
                  </div>
                )}
              </div>
              <div className='min-w-0 flex-1'>
                <DialogTitle className='text-base sm:text-lg leading-tight line-clamp-2'>
                  {selectedProduct?.title}
                </DialogTitle>
                <p className='text-sm text-muted-foreground mt-1'>
                  Selecciona una variante para gestionar
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-4 sm:p-6 pt-4 space-y-2'>
            {selectedProduct?.variants.map((variant) => {
              const isOutOfStock = variant.stock === 0;
              const isLowStock = variant.stock > 0 && variant.stock <= 3;

              return (
                <button
                  key={variant.id}
                  onClick={() => handleOpenVariantMovementModal(variant)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border bg-card transition-all hover:shadow-md hover:border-primary/30 ${isOutOfStock ? "opacity-50" : ""}`}
                >
                  <div
                    className='h-10 w-10 sm:h-12 sm:w-12 rounded-lg ring-1 ring-border shrink-0'
                    style={{ backgroundColor: variant.colorHex }}
                  />

                  <div className='flex-1 min-w-0 text-left'>
                    <div className='font-medium text-sm'>
                      {variant.size} - {variant.colorName}
                    </div>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                      <span>{formatPrice(variant.priceOffer || variant.price)}</span>
                      {isLowStock && (
                        <span className='text-amber-600 dark:text-amber-400 font-medium'>
                          Stock bajo
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={isOutOfStock ? "destructive" : isLowStock ? "warning" : "success"}
                    className='font-mono min-w-[40px] justify-center text-sm shrink-0'
                  >
                    {variant.stock}
                  </Badge>

                  <Settings2 className='h-5 w-5 text-muted-foreground shrink-0' />
                </button>
              );
            })}
          </div>

          <div className='shrink-0 p-4 sm:p-6 pt-0 border-t bg-muted/30'>
            <p className='text-xs text-center text-muted-foreground'>
              Haz clic en una variante para gestionar su stock
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal profesional de movimiento de stock */}
      <StockMovementModal
        product={getModalProduct()}
        isOpen={movementModalOpen}
        onClose={() => {
          setMovementModalOpen(false);
          setSelectedVariant(null);
        }}
        onConfirm={handleMovementConfirm}
      />
    </div>
  );
}
