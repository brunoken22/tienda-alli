"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/product";
import { InventoryMovementType } from "@/types/inventory";
import {
  ShoppingCart,
  Package,
  RotateCcw,
  AlertTriangle,
  Settings,
  Percent,
  Minus,
  Plus,
  DollarSign,
  FileText,
} from "lucide-react";

interface StockMovementModalProps {
  product: Pick<ProductType, "id" | "price" | "stock" | "title" | "images"> | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: StockMovementData) => void;
}

export interface StockMovementData {
  productId: string;
  quantity: number;
  type: InventoryMovementType;
  hasDiscount: boolean;
  discountType: "percentage" | "fixed";
  discountValue: number;
  note: string;
  finalPrice: number;
}

const movementTypes: {
  value: InventoryMovementType;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  bgColor: string;
  isOutput: boolean;
}[] = [
  {
    value: "SALE",
    label: "Venta",
    icon: <ShoppingCart className='h-5 w-5' />,
    description: "Producto vendido a cliente",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200 hover:bg-red-100",
    isOutput: true,
  },
  {
    value: "PURCHASE",
    label: "Compra",
    icon: <Package className='h-5 w-5' />,
    description: "Ingreso de mercadería",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    isOutput: false,
  },
  {
    value: "RETURN",
    label: "Devolución",
    icon: <RotateCcw className='h-5 w-5' />,
    description: "Producto devuelto por cliente",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    isOutput: false,
  },
  {
    value: "DAMAGED",
    label: "Dañado",
    icon: <AlertTriangle className='h-5 w-5' />,
    description: "Producto dañado o vencido",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    isOutput: true,
  },
  {
    value: "ADJUSTMENT",
    label: "Ajuste",
    icon: <Settings className='h-5 w-5' />,
    description: "Ajuste de inventario",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    isOutput: true,
  },
];

export function StockMovementModal({
  product,
  isOpen,
  onClose,
  onConfirm,
}: StockMovementModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedType, setSelectedType] = useState<InventoryMovementType>("SALE");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(0);
  const [note, setNote] = useState("");
  console.log("product", product);
  const resetForm = () => {
    setQuantity(1);
    setSelectedType("SALE");
    setHasDiscount(false);
    setDiscountType("percentage");
    setDiscountValue(0);
    setNote("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!product) return null;

  const selectedTypeInfo = movementTypes.find((t) => t.value === selectedType);
  const isOutput = selectedTypeInfo?.isOutput ?? true;

  // Calculate final price
  const basePrice = product.price * quantity;
  let finalPrice = basePrice;

  if (hasDiscount && selectedType === "SALE") {
    if (discountType === "percentage") {
      finalPrice = basePrice * (1 - discountValue / 100);
    } else {
      finalPrice = Math.max(0, basePrice - discountValue);
    }
  }

  const discountAmount = basePrice - finalPrice;

  const handleConfirm = () => {
    onConfirm({
      productId: product.id,
      quantity,
      type: selectedType,
      hasDiscount,
      discountType,
      discountValue,
      note,
      finalPrice,
    });
    handleClose();
  };

  const canConfirm = quantity > 0 && (isOutput ? product.stock >= quantity : true);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <div className='relative h-12 w-12 overflow-hidden rounded-lg border bg-muted'>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                  <Package className='h-6 w-6' />
                </div>
              )}
            </div>
            <div className='flex-1'>
              <span className='line-clamp-1'>{product.title}</span>
              <div className='flex items-center gap-2 mt-1'>
                <Badge variant='outline' className='text-xs font-normal'>
                  Stock: {product.stock}
                </Badge>
                <span className='text-sm font-normal text-muted-foreground'>
                  ${product.price.toFixed(2)} c/u
                </span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Registra el movimiento de inventario con todos los detalles
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Movement Type Selection */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Tipo de Movimiento</Label>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
              {movementTypes.map((type) => (
                <button
                  key={type.value}
                  type='button'
                  onClick={() => setSelectedType(type.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all ${
                    selectedType === type.value
                      ? `${type.bgColor} ${type.color} border-current`
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  <span
                    className={selectedType === type.value ? type.color : "text-muted-foreground"}
                  >
                    {type.icon}
                  </span>
                  <span className='text-xs font-medium'>{type.label}</span>
                </button>
              ))}
            </div>
            <p className='text-xs text-muted-foreground'>{selectedTypeInfo?.description}</p>
          </div>

          {/* Quantity */}
          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Cantidad</Label>
            <div className='flex items-center gap-3'>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className='h-4 w-4' />
              </Button>

              <Input
                type='number'
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className='w-24 text-center text-lg font-semibold'
                min={1}
                max={isOutput ? product.stock : 9999}
              />

              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => setQuantity(quantity + 1)}
                disabled={isOutput && quantity >= product.stock}
              >
                <Plus className='h-4 w-4' />
              </Button>

              {isOutput && quantity > product.stock && (
                <span className='text-xs text-destructive'>Stock insuficiente</span>
              )}
            </div>
          </div>

          {/* Discount Section - Only for Sales */}
          {selectedType === "SALE" && (
            <div className='space-y-3 rounded-lg border bg-muted/30 p-4'>
              <div className='flex items-center justify-between'>
                <Label className='text-sm font-medium flex items-center gap-2'>
                  <Percent className='h-4 w-4' />
                  Aplicar Descuento
                </Label>

                <button
                  type='button'
                  onClick={() => setHasDiscount(!hasDiscount)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    hasDiscount ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      hasDiscount ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {hasDiscount && (
                <div className='space-y-3 pt-2'>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => setDiscountType("percentage")}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        discountType === "percentage"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      Porcentaje (%)
                    </button>

                    <button
                      type='button'
                      onClick={() => setDiscountType("fixed")}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                        discountType === "fixed"
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      Monto Fijo ($)
                    </button>
                  </div>

                  <div className='relative'>
                    <Input
                      type='number'
                      value={discountValue}
                      onChange={(e) =>
                        setDiscountValue(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      placeholder={discountType === "percentage" ? "Ej: 10" : "Ej: 5.00"}
                      className='pr-10'
                      min={0}
                      max={discountType === "percentage" ? 100 : basePrice}
                    />

                    <span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                      {discountType === "percentage" ? "%" : "$"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Note */}
          <div className='space-y-2'>
            <Label className='text-sm font-medium flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              Nota (Opcional)
            </Label>

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='Agrega una descripción o nota sobre este movimiento...'
              className='resize-none'
              rows={2}
            />
          </div>

          {/* Price Summary - Only for Sales */}
          {selectedType === "SALE" && (
            <div className='rounded-lg border bg-muted/50 p-4 space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal:</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>

              {hasDiscount && discountAmount > 0 && (
                <div className='flex items-center justify-between text-sm text-emerald-600'>
                  <span>Descuento:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className='flex items-center justify-between border-t pt-2'>
                <span className='font-semibold'>Total:</span>

                <span className='text-lg font-bold flex items-center gap-1'>
                  <DollarSign className='h-4 w-4' />
                  {finalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className='gap-2'>
          <Button type='button' variant='outline' onClick={handleClose}>
            Cancelar
          </Button>

          <Button
            type='button'
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={
              selectedTypeInfo?.isOutput
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }
          >
            {selectedTypeInfo?.isOutput ? (
              <>
                <Minus className='h-4 w-4 mr-2' />
                Descontar {quantity}
              </>
            ) : (
              <>
                <Plus className='h-4 w-4 mr-2' />
                Agregar {quantity}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
