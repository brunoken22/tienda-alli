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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type WeeklySalesData = {
  dailySales: {
    day: string;
    dayShort: string;
    ventas: number;
    ingresos: number;
  }[];

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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const salesData = await getInventoryAnalytics();

      setData(salesData);
    } catch {
      console.error("Error loading sales data");
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

  const maxSales = Math.max(...data.dailySales.map((d) => d.ventas));
  const todaySales = data.dailySales[data.dailySales.length - 1]?.ventas || 0;
  const yesterdaySales = data.dailySales[data.dailySales.length - 2]?.ventas || 0;
  const salesTrend = todaySales >= yesterdaySales;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
      {/* Columna izquierda - Estadísticas y Gráfico */}
      <div className='lg:col-span-2 space-y-4'>
        {/* Cards de resumen */}
        <div className='grid grid-cols-2 gap-3'>
          <Card className='border-emerald-200 bg-gradient-to-br from-emerald-50 to-white'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-medium text-emerald-600 uppercase tracking-wide'>
                    Ventas Semana
                  </p>
                  <p className='text-2xl sm:text-3xl font-bold text-emerald-700 mt-1'>
                    {data.totalSales}
                  </p>
                  <p className='text-xs text-emerald-600/80 mt-1'>unidades vendidas</p>
                </div>
                <div className='p-2 bg-emerald-100 rounded-lg'>
                  <ShoppingBag className='h-5 w-5 text-emerald-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='border-blue-200 bg-gradient-to-br from-blue-50 to-white'>
            <CardContent className='p-4'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-xs font-medium text-blue-600 uppercase tracking-wide'>
                    Ingresos
                  </p>
                  <p className='text-xl sm:text-2xl font-bold text-blue-700 mt-1'>
                    {formatPrice(data.totalRevenue)}
                  </p>
                  <div className='flex items-center gap-1 mt-1'>
                    {salesTrend ? (
                      <TrendingUp className='h-3 w-3 text-emerald-500' />
                    ) : (
                      <TrendingDown className='h-3 w-3 text-rose-500' />
                    )}
                    <span
                      className={`text-xs ${salesTrend ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      vs ayer
                    </span>
                  </div>
                </div>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <DollarSign className='h-5 w-5 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de ventas */}
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <BarChart3 className='h-5 w-5 text-muted-foreground' />
              Ventas por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-56 sm:h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={data.dailySales}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#e5e7eb' />
                  <XAxis
                    dataKey='dayShort'
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className='bg-white border rounded-lg shadow-lg p-3'>
                            <p className='font-semibold text-sm'>{data.day}</p>
                            <p className='text-emerald-600 text-sm'>
                              {data.ventas} unidades vendidas
                            </p>
                            <p className='text-blue-600 text-sm'>
                              {formatPrice(data.ingresos)} en ingresos
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey='ventas' radius={[6, 6, 0, 0]}>
                    {data.dailySales.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.ventas === maxSales ? "#10b981" : "#6ee7b7"}
                      />
                    ))}
                  </Bar>
                </BarChart>
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
