"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetrics, getProducts } from "@/lib/products";
import { Package, Palette, Plus, Lock, ShoppingBag, Tag, Logs } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductType } from "@/types/product";
import Loading from "@/components/loading";

export default function DashboardPage() {
  const [products, setProducts] = useState<{ data: ProductType[]; isLoading: boolean }>({
    data: [],
    isLoading: true,
  });
  const [metrics, setMetrics] = useState<{
    products: number;
    categories: number;
    variants: number;
    offer: number;
  }>({
    products: 0,
    categories: 0,
    variants: 0,
    offer: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      const metrics = await getMetrics();
      setProducts(data);
      setMetrics(metrics);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const stats = [
    {
      title: "Total Productos",
      value: loading ? "..." : metrics.products,
      description: `En ${metrics.products} categorías`,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Modelos ",
      value: loading ? "..." : metrics.variants,
      description: "Combinaciones disponibles",
      icon: Palette,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Ofertas",
      value: loading ? "..." : metrics.offer,
      description: "Productos en descuento",
      icon: Tag,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Categorías",
      value: loading ? "..." : metrics.categories,
      description: "Diferentes secciones",
      icon: ShoppingBag,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const quickActions = [
    {
      title: "Agregar Producto",
      description: "Añade un nuevo producto a tu inventario",
      icon: Plus,
      href: "/admin/dashboard/productos?createProduct=true",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Ver Todos los Productos",
      description: "Gestiona tu catálogo completo",
      icon: Package,
      href: "/admin/dashboard/productos",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Ver Todos las categorias",
      description: "Gestiona tus categorias.",
      icon: Logs,
      href: "/admin/dashboard/categorrias",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Cambiar Contraseña",
      description: "Actualiza tu contraseña de acceso",
      icon: Lock,
      href: "/admin/dashboard/cambiar-contrasena",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const recentProducts = products.data.slice(0, 5);

  return (
    <div className='p-2 space-y-6'>
      <div>
        <h2 className='text-3xl font-bold text-primary   mb-2'>Panel de Control</h2>
        <p className='text-muted-foreground'>
          Gestiona tu inventario de productos de manera eficiente
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className='bg-secondary border-2 hover:shadow-lg transition-shadow overflow-hidden'
            >
              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`} />
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className='h-4 w-4 text-white' />
                </div>
              </CardHeader>
              <CardContent className='text-center'>
                <div className='text-3xl  font-bold'>{stat.value}</div>
                <p className='text-xs text-muted-foreground mt-1'>{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className=''>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accede a las funciones principales</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} title={action.title} className=''>
                  <div className='flex border bg-secondary border-primary hover:bg-primary/90 hover:border-primary/10 hover:text-secondary rounded-md mt-4 w-full justify-start items-start h-auto p-4 group transition-all bg-transparent'>
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${action.gradient} mr-3 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className='h-5 w-5 text-white' />
                    </div>
                    <div className='text-left'>
                      <div className='font-semibold'>{action.title}</div>
                      <div className='text-xs text-muted-foreground'>{action.description}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className=''>
          <CardHeader>
            <CardTitle>Productos Recientes</CardTitle>
            <CardDescription>Últimos productos agregados al inventario</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loading />
            ) : recentProducts.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No hay productos aún</p>
            ) : (
              <div className='divide-y divide-border/30 overflow-hidden rounded-lg flex flex-col gap-2'>
                {recentProducts.map((product) => (
                  <Link
                    href={`/productos/${product.id}`}
                    key={product.id}
                    className='bg-secondary hover:opacity-80 flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors'
                  >
                    <div className='flex items-center gap-3 flex-1 '>
                      <div className='flex gap-1.5 flex-wrap'>
                        <div>
                          <img
                            src={product.images[0]}
                            alt=''
                            className='h-12 w-12  rounded-full object-fill'
                          />
                        </div>
                        {product.variant.length > 3 && (
                          <div className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted border'>
                            +{product.variant.length - 3}
                          </div>
                        )}
                      </div>
                      <div className='flex-1 min-w-0  grid grid-cols-1'>
                        <p className='text-sm font-medium truncate'>{product.title}</p>
                        <p className='text-xs text-muted-foreground'>
                          {product.variant.length} variantes
                        </p>
                      </div>
                    </div>
                    <div className='text-right mx-2'>
                      <p className='text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                        ${product.priceOffer || product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
