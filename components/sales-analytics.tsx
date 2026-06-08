"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  Package,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { getInventoryAnalytics } from "@/lib/inventory";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  BarChart,
} from "recharts";
import { Button } from "./ui/button";

type WeeklySalesData = {
  dailySales: {
    day: string;
    dayShort: string;
    ventas: number;
    ingresos: number;
  }[];

  averageDailySales: number;

  bestDay: {
    day: string;
    ventas: number;
  } | null;

  bestRevenueDay: {
    day: string;
    ingresos: number;
  } | null;

  bestProduct: {
    productId: string;
    title: string;
    totalSold: number;
  } | null;

  topProducts: {
    productId: string;
    title: string;
    totalSold: number;
    currentStock: number;
    avgDailySales: number;
    recommendation: number;
    price: number;

    variants: {
      variantId: string;
      colorName: string;
      colorHex: string;
      size: string;
      totalSold: number;
      currentStock: number;
      recommendation: number;
    }[];
  }[];

  totalSales: number;
  totalRevenue: number;
};

export function SalesAnalytics() {
  const [data, setData] = useState<WeeklySalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "month">("7d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadData();
  }, [range]);

  async function loadData() {
    setIsLoading(true);

    try {
      const salesData = await getInventoryAnalytics({
        range,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setData(salesData);
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

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            {[...Array(2)].map((_, i) => (
              <div key={i} className='animate-pulse rounded-xl border bg-muted/50 p-4 h-24' />
            ))}
          </div>
          <div className='animate-pulse rounded-xl border bg-muted/50 h-72' />
        </div>
        <div className='animate-pulse rounded-xl border bg-muted/50 h-96' />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
      {/* Columna izquierda - Estadísticas y Gráfico */}

      <div className='lg:col-span-2 space-y-4'>
        {/* KPIs */}
        <div className='grid grid-cols-2 lg:grid-cols-5 gap-3'>
          <Card>
            <CardContent className='p-4'>
              <p className='text-xs text-muted-foreground'>Ventas</p>

              <p className='text-3xl font-bold'>{data.totalSales}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <p className='text-xs text-muted-foreground'>Ingresos</p>

              <p className='text-lg font-bold'>{formatPrice(data.totalRevenue)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <p className='text-xs text-muted-foreground'>Promedio Diario</p>

              <p className='text-3xl font-bold'>{data.averageDailySales}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <p className='text-xs text-muted-foreground'>Mejor Día</p>

              <p className='font-bold'>{data.bestDay?.day || "-"}</p>

              <p className='text-xs text-muted-foreground'>{data.bestDay?.ventas || 0} ventas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <p className='text-xs text-muted-foreground'>Producto Top</p>

              <p className='font-bold truncate'>{data.bestProduct?.title || "-"}</p>

              <p className='text-xs text-muted-foreground'>
                {data.bestProduct?.totalSold || 0} vendidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico principal */}
        <Card>
          <CardHeader>
            <div className='flex justify-between items-center flex-wrap gap-2'>
              <CardTitle className='flex items-center gap-2'>
                <BarChart3 className='h-5 w-5' />
                Ventas por Fecha
              </CardTitle>

              <div className='flex gap-2'>
                <Badge
                  className='cursor-pointer'
                  variant={range === "7d" ? "default" : "outline"}
                  onClick={() => setRange("7d")}
                >
                  7 días
                </Badge>

                <Badge
                  className='cursor-pointer'
                  variant={range === "30d" ? "default" : "outline"}
                  onClick={() => setRange("30d")}
                >
                  30 días
                </Badge>

                <Badge
                  className='cursor-pointer'
                  variant={range === "month" ? "default" : "outline"}
                  onClick={() => setRange("month")}
                >
                  Este mes
                </Badge>
              </div>
              <div className='flex flex-wrap gap-2 mt-3'>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='border rounded-md px-3 py-2 text-sm'
                />

                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='border rounded-md px-3 py-2 text-sm'
                />

                <Button
                  variant='primary'
                  className='px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm'
                  onClick={loadData}
                >
                  Filtrar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <ComposedChart data={data.dailySales}>
                  <CartesianGrid strokeDasharray='3 3' />

                  <XAxis dataKey='dayShort' interval='preserveStartEnd' minTickGap={25} />
                  <YAxis yAxisId='left' allowDecimals={false} />

                  <YAxis yAxisId='right' orientation='right' />

                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "ingresos") {
                        return [formatPrice(Number(value)), "Ingresos"];
                      }

                      return [value, "Ventas"];
                    }}
                  />

                  <Bar yAxisId='left' dataKey='ventas' radius={[6, 6, 0, 0]} />

                  <Line yAxisId='right' dataKey='ingresos' type='monotone' strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna derecha - Recomendaciones de compra */}
      <Card className='h-fit'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Package className='h-5 w-5 text-muted-foreground' />
            Recomendación de Compra
          </CardTitle>
          <p className='text-xs text-muted-foreground'>Basado en ventas de la semana</p>
        </CardHeader>
        <CardContent className='space-y-4'>
          {data.topProducts.map((product, index) => {
            const isLowStock = product.currentStock <= 5;
            const isCritical = product.currentStock <= 2;
            const variantsToRestock = product.variants.filter((v) => v.recommendation > 0);

            return (
              <div
                key={product.productId}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isCritical
                    ? "bg-rose-50 border-rose-200"
                    : isLowStock
                      ? "bg-amber-50 border-amber-200"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                {/* Header del producto */}
                <div className='flex items-center justify-between gap-2 mb-2'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <span className='text-xs font-bold text-muted-foreground shrink-0'>
                      #{index + 1}
                    </span>
                    <h4 className='font-semibold text-sm truncate'>{product.title}</h4>
                  </div>
                  <div className='flex items-center gap-1.5 shrink-0'>
                    <Badge
                      variant={isCritical ? "destructive" : isLowStock ? "warning" : "secondary"}
                      className='text-xs'
                    >
                      {product.totalSold} vendidos
                    </Badge>
                  </div>
                </div>

                {/* Variantes a reponer */}
                {variantsToRestock.length > 0 ? (
                  <div className='space-y-1.5'>
                    {variantsToRestock.map((variant) => {
                      const isVariantCritical = variant.currentStock <= 2;
                      const isVariantLow = variant.currentStock <= 5;

                      return (
                        <div
                          key={variant.variantId}
                          className='flex items-center justify-between gap-2 bg-white/70 rounded-lg px-2.5 py-2 border border-white'
                        >
                          <div className='flex items-center gap-2 min-w-0'>
                            {/* Color dot */}
                            <span
                              className='h-3.5 w-3.5 rounded-full ring-1 ring-border shrink-0'
                              style={{ backgroundColor: variant.colorHex }}
                            />
                            <span className='text-xs font-medium truncate'>
                              {variant.colorName} · T{variant.size}
                            </span>
                          </div>
                          <div className='flex items-center gap-2 shrink-0'>
                            {/* Stock actual */}
                            <span
                              className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                isVariantCritical
                                  ? "bg-rose-100 text-rose-700"
                                  : isVariantLow
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              stock: {variant.currentStock}
                            </span>
                            {/* Cantidad a comprar */}
                            <div className='flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg'>
                              <ArrowRight className='h-3 w-3' />
                              <span className='text-xs font-bold'>+{variant.recommendation}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className='text-xs text-muted-foreground text-center py-1'>
                    Stock suficiente en todas las variantes
                  </p>
                )}
              </div>
            );
          })}

          {data.topProducts.length === 0 && (
            <div className='text-center py-8 text-muted-foreground'>
              <Package className='h-10 w-10 mx-auto mb-2 opacity-50' />
              <p className='text-sm'>Sin datos de ventas</p>
            </div>
          )}

          {/* Resumen total */}
          {data.topProducts.some((p) => p.variants.some((v) => v.recommendation > 0)) && (
            <div className='p-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl'>
              <div className='flex items-center gap-2 mb-2'>
                <ShoppingBag className='h-4 w-4 text-emerald-600' />
                <span className='font-semibold text-sm text-emerald-700'>Resumen de Compra</span>
              </div>
              <div className='space-y-1 text-xs'>
                {data.topProducts.flatMap((p) =>
                  p.variants
                    .filter((v) => v.recommendation > 0)
                    .map((v) => (
                      <div
                        key={v.variantId}
                        className='flex items-center justify-between text-emerald-600 gap-2'
                      >
                        <div className='flex items-center gap-1.5 min-w-0'>
                          <span
                            className='h-2.5 w-2.5 rounded-full ring-1 ring-emerald-300 shrink-0'
                            style={{ backgroundColor: v.colorHex }}
                          />
                          <span className='truncate'>
                            {p.title} · {v.colorName} T{v.size}
                          </span>
                        </div>
                        <span className='font-mono font-bold shrink-0'>{v.recommendation} uds</span>
                      </div>
                    )),
                )}
                <div className='border-t border-emerald-200 pt-2 mt-2 flex justify-between font-semibold text-emerald-700'>
                  <span>Total a comprar</span>
                  <span>
                    {data.topProducts.reduce(
                      (acc, p) => acc + p.variants.reduce((a, v) => a + v.recommendation, 0),
                      0,
                    )}{" "}
                    unidades
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
