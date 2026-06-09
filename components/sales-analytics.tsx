"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  ArrowRight,
  BarChart3,
  CalendarRange,
  Crown,
  Activity,
  Boxes,
  AlertTriangle,
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
  Cell,
  Legend,
} from "recharts";

type Range = "7d" | "30d" | "90d" | "month";

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

const RANGES: { key: Range; label: string }[] = [
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "90d", label: "90 días" },
  { key: "month", label: "Este mes" },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCompact(n: number) {
  return new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 }).format(
    n,
  );
}

// Color palette derived from the CSS variables
// --primary: #c98185  --secondary: #ed989a
const COLORS = {
  primary: "#c98185",
  primaryLight: "#f5e8e8", // very light tint for backgrounds
  primaryMid: "#e8c5c6", // medium tint for borders
  secondary: "#ed989a",
  secondaryLight: "#fdf0f0",
  criticalBg: "#fef2f2", // red-50 equivalent
  criticalBorder: "#fecaca", // red-200 equivalent
  criticalText: "#dc2626", // red-600
  lowBg: "#fffbeb", // amber-50 equivalent
  lowBorder: "#fde68a", // amber-200 equivalent
  lowText: "#d97706", // amber-600
  okBg: "#f0fdf4", // green-50 equivalent
  okBorder: "#bbf7d0", // green-200 equivalent
  okText: "#16a34a", // green-600
  chartBar: "#c98185",
  chartLine: "#ed989a",
  neutral: "#f5f5f5",
  neutralBorder: "#e5e7eb",
  mutedText: "#6b7280",
};

export function SalesAnalytics() {
  const [data, setData] = useState<WeeklySalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [range, setRange] = useState<Range>("7d");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isLoading && !data) return <DashboardSkeleton />;
  if (!data) return null;

  const totalToBuy = data.topProducts.reduce(
    (acc, p) => acc + p.variants.reduce((a, v) => a + v.recommendation, 0),
    0,
  );

  return (
    <div className='space-y-6'>
      {/* Encabezado */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <span
              className='flex h-9 w-9 items-center justify-center rounded-xl'
              style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
            >
              <Activity className='h-5 w-5' />
            </span>
            <h1 className='text-2xl font-semibold tracking-tight text-balance'>
              Panel de Ventas e Inventario
            </h1>
          </div>
          <p className='text-sm' style={{ color: COLORS.mutedText }}>
            Rendimiento de la tienda y sugerencias de reposición en tiempo real
          </p>
        </div>

        {/* Selector de rango segmentado */}
        <div
          className='inline-flex rounded-xl p-1 shadow-sm'
          style={{ border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#fff" }}
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className='rounded-lg px-3 py-1.5 text-sm font-medium transition-all'
              style={
                range === r.key
                  ? { backgroundColor: COLORS.primary, color: "#fff" }
                  : { color: COLORS.mutedText }
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Columna izquierda */}
        <div className='space-y-6 lg:col-span-2'>
          {/* KPIs */}
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            <KpiCard
              icon={<ShoppingBag className='h-4 w-4' />}
              label='Ventas totales'
              value={String(data.totalSales)}
              hint={`${data.averageDailySales} / día prom.`}
              accent='primary'
            />
            <KpiCard
              icon={<DollarSign className='h-4 w-4' />}
              label='Ingresos'
              value={formatCompact(data.totalRevenue)}
              hint={formatPrice(data.totalRevenue)}
              accent='secondary'
            />
            <KpiCard
              icon={<TrendingUp className='h-4 w-4' />}
              label='Mejor día'
              value={data.bestDay?.day ?? "-"}
              hint={`${data.bestDay?.ventas ?? 0} ventas`}
              accent='neutral'
            />
            <KpiCard
              icon={<Crown className='h-4 w-4' />}
              label='Producto top'
              value={data.bestProduct?.title ?? "-"}
              hint={`${data.bestProduct?.totalSold ?? 0} vendidos`}
              accent='primary'
              truncate
            />
          </div>

          {/* Gráfico principal */}
          <Card className='overflow-hidden'>
            <CardHeader style={{ borderBottom: `1px solid ${COLORS.neutralBorder}` }}>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <BarChart3 className='h-5 w-5' style={{ color: COLORS.primary }} />
                  Ventas por fecha
                </CardTitle>
                <div className='flex flex-wrap items-center gap-2'>
                  <div
                    className='flex items-center gap-2 rounded-lg px-2.5 py-1.5'
                    style={{
                      border: `1px solid ${COLORS.neutralBorder}`,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <CalendarRange className='h-4 w-4' style={{ color: COLORS.mutedText }} />
                    <input
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className='bg-transparent text-sm outline-none'
                      aria-label='Fecha de inicio'
                    />
                    <span style={{ color: COLORS.mutedText }}>—</span>
                    <input
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className='bg-transparent text-sm outline-none'
                      aria-label='Fecha de fin'
                    />
                  </div>
                  <Button size='sm' onClick={loadData} disabled={isLoading}>
                    {isLoading ? "Cargando…" : "Filtrar"}
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className='pt-6'>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <ComposedChart
                    data={data.dailySales}
                    onMouseMove={(state) => {
                      if (state?.activeTooltipIndex != null)
                        setActiveIndex(Number(state.activeTooltipIndex));
                    }}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <defs>
                      <linearGradient id='barFill' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor={COLORS.primary} stopOpacity={0.95} />
                        <stop offset='100%' stopColor={COLORS.primary} stopOpacity={0.55} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke={COLORS.neutralBorder}
                      vertical={false}
                    />
                    <XAxis
                      dataKey='dayShort'
                      interval='preserveStartEnd'
                      minTickGap={20}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: COLORS.mutedText, fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId='left'
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: COLORS.mutedText, fontSize: 12 }}
                    />
                    <YAxis
                      yAxisId='right'
                      orientation='right'
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => formatCompact(Number(v))}
                      tick={{ fill: COLORS.mutedText, fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: COLORS.primaryLight, opacity: 0.6 }}
                      contentStyle={{
                        background: "#fff",
                        border: `1px solid ${COLORS.neutralBorder}`,
                        borderRadius: "0.75rem",
                        boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)",
                      }}
                      formatter={(value, name) => {
                        if (name === "ingresos") return [formatPrice(Number(value)), "Ingresos"];
                        return [value, "Ventas"];
                      }}
                    />
                    <Legend
                      iconType='circle'
                      wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                      formatter={(v) => (v === "ventas" ? "Ventas" : "Ingresos")}
                    />
                    <Bar yAxisId='left' dataKey='ventas' radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {data.dailySales.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            activeIndex === null || activeIndex === i
                              ? "url(#barFill)"
                              : COLORS.primary
                          }
                          fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.3}
                        />
                      ))}
                    </Bar>
                    <Line
                      yAxisId='right'
                      dataKey='ingresos'
                      type='monotone'
                      stroke={COLORS.secondary}
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5, fill: COLORS.secondary }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Recomendaciones */}
        <Card className='h-fit'>
          <CardHeader
            className='pb-4'
            style={{ borderBottom: `1px solid ${COLORS.neutralBorder}` }}
          >
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Package className='h-5 w-5' style={{ color: COLORS.primary }} />
                Recomendación de compra
              </CardTitle>
              {totalToBuy > 0 && (
                <span
                  className='rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold'
                  style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
                >
                  {totalToBuy} uds
                </span>
              )}
            </div>
            <p className='text-xs' style={{ color: COLORS.mutedText }}>
              Basado en las ventas del período seleccionado
            </p>
          </CardHeader>

          <CardContent className='space-y-3 pt-4'>
            {data.topProducts.map((product, index) => (
              <ProductRecommendation key={product.productId} product={product} index={index} />
            ))}

            {data.topProducts.length === 0 && (
              <div className='py-10 text-center' style={{ color: COLORS.mutedText }}>
                <Boxes className='mx-auto mb-2 h-10 w-10 opacity-40' />
                <p className='text-sm'>Sin datos de ventas</p>
              </div>
            )}

            {totalToBuy > 0 && (
              <div
                className='rounded-xl p-4'
                style={{ border: `1px solid ${COLORS.okBorder}`, backgroundColor: COLORS.okBg }}
              >
                <div className='mb-3 flex items-center gap-2'>
                  <ShoppingBag className='h-4 w-4' style={{ color: COLORS.okText }} />
                  <span className='text-sm font-semibold' style={{ color: COLORS.okText }}>
                    Resumen de compra
                  </span>
                </div>
                <div className='space-y-1.5 text-xs'>
                  {data.topProducts.flatMap((p) =>
                    p.variants
                      .filter((v) => v.recommendation > 0)
                      .map((v) => (
                        <div key={v.variantId} className='flex items-center justify-between gap-2'>
                          <div className='flex min-w-0 items-center gap-1.5'>
                            <span
                              className='h-2.5 w-2.5 shrink-0 rounded-full'
                              style={{
                                backgroundColor: v.colorHex,
                                outline: `1px solid ${COLORS.neutralBorder}`,
                              }}
                            />
                            <span className='truncate' style={{ color: COLORS.mutedText }}>
                              {p.title} · {v.colorName} T{v.size}
                            </span>
                          </div>
                          <span className='shrink-0 font-mono font-semibold'>
                            {v.recommendation}
                          </span>
                        </div>
                      )),
                  )}
                  <div
                    className='mt-2 flex justify-between pt-2 text-sm font-semibold'
                    style={{ borderTop: `1px solid ${COLORS.okBorder}`, color: COLORS.okText }}
                  >
                    <span>Total a comprar</span>
                    <span>{totalToBuy} unidades</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  hint,
  accent,
  truncate,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  accent: "primary" | "secondary" | "neutral";
  truncate?: boolean;
}) {
  const iconStyle =
    accent === "primary"
      ? { backgroundColor: COLORS.primaryLight, color: COLORS.primary }
      : accent === "secondary"
        ? { backgroundColor: "#fdf0f0", color: COLORS.secondary }
        : { backgroundColor: COLORS.neutral, color: COLORS.mutedText };

  return (
    <Card className='transition-all hover:-translate-y-0.5 hover:shadow-md'>
      <CardContent className='p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <span className='text-xs font-medium' style={{ color: COLORS.mutedText }}>
            {label}
          </span>
          <span className='flex h-7 w-7 items-center justify-center rounded-lg' style={iconStyle}>
            {icon}
          </span>
        </div>
        <p className={`text-2xl font-bold tracking-tight ${truncate ? "truncate text-lg" : ""}`}>
          {value}
        </p>
        <p className='mt-0.5 truncate text-xs' style={{ color: COLORS.mutedText }}>
          {hint}
        </p>
      </CardContent>
    </Card>
  );
}

function ProductRecommendation({
  product,
  index,
}: {
  product: WeeklySalesData["topProducts"][number];
  index: number;
}) {
  const isCritical = product.currentStock <= 2;
  const isLowStock = product.currentStock <= 5;
  const variantsToRestock = product.variants.filter((v) => v.recommendation > 0);

  const wrapperStyle = isCritical
    ? { border: `1px solid ${COLORS.criticalBorder}`, backgroundColor: COLORS.criticalBg }
    : isLowStock
      ? { border: `1px solid ${COLORS.lowBorder}`, backgroundColor: COLORS.lowBg }
      : { border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#fafafa" };

  return (
    <div className='rounded-xl p-3 transition-all hover:shadow-sm' style={wrapperStyle}>
      <div className='mb-2 flex items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <span
            className='flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold'
            style={
              index === 0
                ? { backgroundColor: COLORS.primary, color: "#fff" }
                : { backgroundColor: COLORS.neutral, color: COLORS.mutedText }
            }
          >
            {index + 1}
          </span>
          <h4 className='truncate text-sm font-semibold'>{product.title}</h4>
        </div>
        <span
          className='shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium'
          style={
            isCritical
              ? {
                  backgroundColor: COLORS.criticalBg,
                  color: COLORS.criticalText,
                  border: `1px solid ${COLORS.criticalBorder}`,
                }
              : isLowStock
                ? {
                    backgroundColor: COLORS.lowBg,
                    color: COLORS.lowText,
                    border: `1px solid ${COLORS.lowBorder}`,
                  }
                : {
                    backgroundColor: COLORS.neutral,
                    color: COLORS.mutedText,
                    border: `1px solid ${COLORS.neutralBorder}`,
                  }
          }
        >
          {isCritical && <AlertTriangle className='h-3 w-3' />}
          {product.totalSold} vend.
        </span>
      </div>

      {variantsToRestock.length > 0 ? (
        <div className='space-y-1.5'>
          {variantsToRestock.map((variant) => {
            const vCritical = variant.currentStock <= 2;
            const vLow = variant.currentStock <= 5;

            const stockStyle = vCritical
              ? { backgroundColor: COLORS.criticalBg, color: COLORS.criticalText }
              : vLow
                ? { backgroundColor: COLORS.lowBg, color: COLORS.lowText }
                : { backgroundColor: COLORS.neutral, color: COLORS.mutedText };

            return (
              <div
                key={variant.variantId}
                className='flex items-center justify-between gap-2 rounded-lg px-2.5 py-2'
                style={{ border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#fff" }}
              >
                <div className='flex min-w-0 items-center gap-2'>
                  <span
                    className='h-3.5 w-3.5 shrink-0 rounded-full'
                    style={{
                      backgroundColor: variant.colorHex,
                      outline: `1px solid ${COLORS.neutralBorder}`,
                    }}
                  />
                  <span className='truncate text-xs font-medium'>
                    {variant.colorName} · T{variant.size}
                  </span>
                </div>
                <div className='flex shrink-0 items-center gap-2'>
                  <span className='rounded px-1.5 py-0.5 font-mono text-xs' style={stockStyle}>
                    stock {variant.currentStock}
                  </span>
                  <span
                    className='flex items-center gap-1 rounded-lg px-2 py-0.5'
                    style={{ backgroundColor: COLORS.okBg, color: COLORS.okText }}
                  >
                    <ArrowRight className='h-3 w-3' />
                    <span className='text-xs font-bold'>+{variant.recommendation}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className='py-1 text-center text-xs' style={{ color: COLORS.mutedText }}>
          Stock suficiente en todas las variantes
        </p>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div
        className='h-10 w-72 animate-pulse rounded-lg'
        style={{ backgroundColor: COLORS.neutral }}
      />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-24 animate-pulse rounded-xl'
                style={{ border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#f9f9f9" }}
              />
            ))}
          </div>
          <div
            className='h-96 animate-pulse rounded-xl'
            style={{ border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#f9f9f9" }}
          />
        </div>
        <div
          className='h-[32rem] animate-pulse rounded-xl'
          style={{ border: `1px solid ${COLORS.neutralBorder}`, backgroundColor: "#f9f9f9" }}
        />
      </div>
    </div>
  );
}
