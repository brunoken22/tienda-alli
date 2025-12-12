"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ProductDialog } from "@/components/admin/product-dialog";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/products";
import { Plus, Pencil, Trash2, Package, Grid3X3, List } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/admin";
import SimpleHoverSwiper from "@/components/HoverSwiper";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const createProduct = searchParams.get("createProduct");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [offset, setOffset] = useState(Number(searchParams.get("offset")) || 0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeSearch, setTypeSearch] = useState<string[]>(
    JSON.parse(searchParams.get("type")!) || []
  );
  const [typePrice, setTypePrice] = useState<number[]>(
    JSON.parse(searchParams.get("price")!) || [0, 70000]
  );
  const [alertForm, setAlertForm] = useState({
    success: false,
    message: "",
  });
  const [products, setProducts] = useState<{ data: Product[]; isLoading: boolean }>({
    data: [],
    isLoading: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProductsData = async () => {
      const data = await getProducts();
      setProducts({
        isLoading: false,
        data,
      });
    };
    getProductsData();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (
      createProduct &&
      createProduct.trim() &&
      Boolean(createProduct?.trim()) &&
      Boolean(createProduct?.trim()) === true
    ) {
      setDialogOpen(Boolean(createProduct?.trim()));
    }
  }, [createProduct]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      const response = await deleteProduct(id);
      if (!response.success) {
        return;
      }
      setProducts((state) => {
        const filterProducts = state.data.filter((product) => product.id !== id);
        return { isLoading: false, data: filterProducts };
      });
    }
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id" | "createdAt">,
    images: File[]
  ) => {
    console.log(productData, images);
    if (
      !productData.title ||
      !productData.price ||
      // !productData.stock ||
      !images.length ||
      !productData.description ||
      !productData.category.length ||
      // !productData.sizes.length ||
      (productData.variant.length &&
        productData.variant.some((v) => !v.color || !v.price || !v.sizes.length))
    ) {
      setAlertForm((alert) => ({
        ...alert,
        message: "Por favor completa todos los campos requeridos.",
      }));
      setTimeout(() => {
        document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return false;
    }
    setAlertForm({
      message: "",
      success: false,
    });
    const formData = new FormData();
    formData.append(
      "title",
      productData.title.trim()[0].toUpperCase() + productData.title.trim().slice(1)
    );
    formData.append("price", productData.price.toString());
    formData.append("priceOffer", productData.priceOffer.toString());

    // formData.append("stock", productData.stock.toString());
    formData.append(
      "description",
      productData.description.trim()[0].toUpperCase() + productData.description.trim().slice(1)
    );
    if (productData.variant.length) {
      productData.variant.map((variant) => formData.append("variant", JSON.stringify(variant)));
    }
    if (productData.sizes.length) {
      productData.sizes.map((size) =>
        formData.append("sizes", size.trim()[0].toUpperCase() + size.trim().slice(1))
      );
    }
    if (images.length) {
      images.map((image) => formData.append("images", image));
    }
    if (productData.category.length) {
      productData.category.map((category) =>
        formData.append("category", category.trim()[0].toUpperCase() + category.trim().slice(1))
      );
    }

    if (editingProduct) {
      const productUpdate = await updateProduct(editingProduct.id, formData);
      if (productUpdate.success) {
        const updateProduct = { ...productUpdate.data.product, id: productUpdate.data.id };

        setProducts((data) => {
          const updateProducts = data.data.map((product) =>
            product.id === editingProduct.id ? updateProduct : product
          );
          return {
            isLoading: false,
            data: updateProducts,
          };
        });
        return true;
      }
      setAlertForm((alert) => ({
        ...alert,
        message: productUpdate.message,
      }));

      return false;
    } else {
      const product = await addProduct(formData);
      if (product.success) {
        setProducts((data) => ({
          isLoading: false,
          data: [product.data as Product, ...data.data],
        }));
        return true;
      }
      setAlertForm((alert) => ({
        ...alert,
        message: product.message,
      }));

      return false;
    }
  };
  return (
    <div>
      <main className='p-6 max-sm:p-2 space-y-8'>
        <div className='flex max-sm:flex-col max-sm:gap-4 justify-between items-center '>
          <div className='border-l-4 p-2 max-sm:border-0 max-sm:p-0 border-primary'>
            <h2 className='text-2xl font-bold text-foreground mb-2'>Gestión de Productos</h2>
            <p className='text-muted-foreground'>Administra tu catálogo de productos</p>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='flex border rounded-lg overflow-hidden'>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size='sm'
                onClick={() => setViewMode("grid")}
                className='rounded-none'
              >
                <Grid3X3 className='w-4 h-4' />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size='sm'
                onClick={() => setViewMode("list")}
                className='rounded-none'
              >
                <List className='w-4 h-4' />
              </Button>
            </div>
            <Button onClick={handleAddProduct} className='gap-2'>
              <Plus className='w-4 h-4' />
              Agregar Producto
            </Button>
          </div>
        </div>

        {products.isLoading ? (
          <svg className='animate-spin h-5 w-5 mr-3 ...' viewBox='0 0 24 24' />
        ) : products.data.length ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-5"
            }
          >
            {products.data.map((product: Product) => (
              <div
                key={product.id}
                className={`bg-secondary border border-border/60 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-primary/30 transition-all duration-500 group ${
                  viewMode === "list" ? "flex flex-row" : "flex flex-col"
                }`}
              >
                <div
                  className={`relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 ${
                    viewMode === "list" ? "w-80 flex-shrink-0" : "aspect-square"
                  }`}
                >
                  <div className='absolute top-4 right-4 z-10 flex flex-col gap-2.5 items-end'>
                    {product.priceOffer > 1 && (
                      <Badge className='bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 hover:from-rose-600 hover:via-pink-600 hover:to-red-600 border-0 shadow-2xl backdrop-blur-xl text-white text-xs font-bold px-3 py-1.5 rounded-full animate-in slide-in-from-right-5'>
                        AHORRA{" "}
                        {Math.round(((product.price - product.priceOffer) / product.price) * 100)}%
                      </Badge>
                    )}
                    {product.variant.length > 0 && (
                      <Badge className='backdrop-blur-xl bg-gradient-to-r from-violet-500/90 to-purple-500/90 border-0 shadow-xl text-white text-xs font-semibold px-3 py-1.5 rounded-full'>
                        {product.variant.length}{" "}
                        {product.variant.length === 1 ? "Modelo" : "Modelos"}
                      </Badge>
                    )}
                  </div>

                  <div className='h-full'>
                    <SimpleHoverSwiper imageUrls={product.images} title={product.title} />
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                </div>

                <div
                  className={`p-2 flex flex-col ${
                    viewMode === "list" ? "flex-1 justify-between" : ""
                  }`}
                >
                  <div className='flex-1 space-y-4'>
                    <div className='space-y-3'>
                      <h3 className='font-bold  leading-tight line-clamp-2 text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text'>
                        {product.title[0].toUpperCase() + product.title.slice(1)}
                      </h3>

                      <div className='flex flex-wrap gap-2'>
                        {product.category.map((cat, i) => (
                          <Badge
                            key={i}
                            variant='outline'
                            className='text-xs font-semibold border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:border-primary/40 hover:bg-primary/15 transition-all px-3 py-1 rounded-full'
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {viewMode === "list" && product.description && (
                      <p className='text-sm text-muted-foreground/90 line-clamp-2 leading-relaxed'>
                        {product.description}
                      </p>
                    )}

                    {/* {product.variant.length > 0 && (
                      <div className=' bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-border/40'>
                        <p className='text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2'>
                          <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
                          Colores disponibles
                        </p>
                        <div className='flex flex-wrap gap-2.5'>
                          {product.variant.slice(0, 4).map((variant, i) => (
                            <div
                              key={i}
                              className='flex items-center gap-2.5 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-xl border-2 border-border/50 hover:border-primary/50 hover:shadow-md transition-all group/variant'
                            >
                              {variant.color}:
                              <span className='text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                                ${variant.price.toLocaleString()}
                              </span>
                            </div>
                          ))}
                          {product.variant.length > 4 && (
                            <div className='flex items-center justify-center px-3 py-2 text-xs font-bold text-primary bg-primary/10 rounded-xl border-2 border-primary/20'>
                              +{product.variant.length - 4} más
                            </div>
                          )}
                        </div>
                      </div>
                    )} */}

                    {product.sizes.length > 0 && (
                      <div className='space-y-3'>
                        <p className='text-xs font-bold text-secondary-foreground uppercase tracking-widest flex items-center gap-2'>
                          <span className='w-1.5 h-1.5 rounded-full bg-secondary animate-pulse' />
                          Tallas disponibles
                        </p>
                        <div className='flex flex-wrap gap-2'>
                          {product.sizes.map((size, i) => (
                            <Badge
                              key={i}
                              className='text-xs font-bold bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border-2 border-blue-500/30 text-secondary dark:text-secondary px-3 py-1.5 rounded-lg transition-all hover:scale-105'
                            >
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='flex items-baseline gap-3 '>
                      {product.priceOffer && product.priceOffer > 1 ? (
                        <>
                          <span className='text-lg text-green-600  font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm'>
                            ${product.priceOffer.toLocaleString()}
                          </span>
                          <span className='text-base text-primary line-through font-semibold'>
                            ${product.price.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className='text-lg font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary'>
                          ${product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='flex gap-3 pt-5 border-t-2 border-border/40'>
                    <Button
                      variant='primary'
                      className='flex-1 gap-2 transition-all font-semibold border-2'
                      size='md'
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className='w-4 h-4' />
                      <span className='max-sm:hidden'>Editar</span>
                    </Button>
                    <Button
                      variant='outline'
                      size='md'
                      className='flex-1 gap-2 bg-secondary border-red-400 hover:bg-red-600 shadow-lg hover:shadow-xl transition-all font-semibold  border-2'
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className='w-4 h-4' />
                      <span className='max-sm:hidden'>Eliminar</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='!mt-12  border-primary/50  max-sm:border-t-4 max-sm:pt-8'>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Package className='w-16 h-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>No hay productos</h3>
              <p className='text-center mb-4'>Comienza agregando tu primer producto</p>
            </CardContent>
          </div>
        )}

        <ProductDialog
          alert={alertForm}
          setAlert={setAlertForm}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      </main>
    </div>
  );
}
