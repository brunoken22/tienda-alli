"use client";

import { useState, useEffect, Suspense, SetStateAction, Dispatch } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { ProductDialog } from "@/components/admin/product-dialog";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  publishedProduct,
} from "@/lib/products";
import { Plus, Package, Search, Filter, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/product";
import { ProductCardSkeletonGrid } from "@/components/ui/EsqueletonCardSwiper";
import "./styles.css";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/category";
import { CategoryType } from "@/types/category";
import { getPriceFilter } from "@/lib/price";
import { PriceFilterType } from "@/types/price-filter";
import TemplateProductDashboard from "@/components/TemplateProductDashboard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const createProduct = searchParams.get("createProduct");

  // Parámetros de búsqueda desde URL
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 100000
  );
  const [onSale, setOnSale] = useState(searchParams.get("onSale") === "true");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);
  const [sortBy, setSortBy] = useState<"title" | "price" | "priceOffer" | "createdAt">(
    (searchParams.get("sortBy") as any) || "title"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as any) || "asc"
  );

  const [alertForm, setAlertForm] = useState({
    success: false,
    message: "",
  });
  const [products, setProducts] = useState<{
    data: ProductType[];
    isLoading: boolean;
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
    isLoading: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>({
    maxPrice: 100000,
    minPrice: 0,
    maxPriceOffer: 100000,
    minPriceOffer: 0,
  });

  // Cargar categorías para el filtro
  useEffect(() => {
    const loadCategoriesAndPrice = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        const priceFilterData = await getPriceFilter();
        setPriceFilter(priceFilterData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategoriesAndPrice();
  }, []);

  // Actualizar URL con parámetros de búsqueda
  const updateURL = () => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (category) params.set("category", category);
    if (minPrice > 0) params.set("minPrice", minPrice.toString());
    if (maxPrice < 100000) params.set("maxPrice", maxPrice.toString());
    if (onSale) params.set("onSale", "true");
    if (page > 1) params.set("page", page.toString());
    if (limit !== 12) params.set("limit", limit.toString());
    if (sortBy !== "title") params.set("sortBy", sortBy);
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder);

    router.push(`?${params.toString()}`);
  };

  // Cargar productos con filtros
  useEffect(() => {
    const getProductsData = async () => {
      try {
        setProducts((prev) => ({ ...prev, isLoading: true }));

        const queryParams: any = {};
        if (searchTerm) queryParams.search = searchTerm;
        if (category) queryParams.category = category;
        if (minPrice > 0) queryParams.minPrice = minPrice;
        if (maxPrice < 100000) queryParams.maxPrice = maxPrice;
        if (onSale) queryParams.onSale = onSale;
        queryParams.page = page;
        queryParams.limit = limit;
        queryParams.sortBy = sortBy;
        queryParams.sortOrder = sortOrder;

        const response = await getProducts(queryParams);
        if (response.success) {
          setProducts({
            isLoading: false,
            data: response.data,
            pagination: response.pagination,
          });
        } else {
          setProducts({
            isLoading: false,
            data: [],
          });
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts({
          isLoading: false,
          data: [],
        });
      }
    };

    getProductsData();
    updateURL();
  }, [searchTerm, category, minPrice, maxPrice, onSale, page, limit, sortBy, sortOrder]);

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

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetear a primera página al buscar
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setCategory("");
    setMinPrice(0);
    setMaxPrice(100000);
    setOnSale(false);
    setPage(1);
    setSortBy("title");
    setSortOrder("asc");
  };

  // Navegación de páginas
  const handleNextPage = () => {
    if (products.pagination?.hasNextPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: ProductType) => {
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
        return { ...state, data: filterProducts };
      });
    }
  };

  const handleSaveProduct = async (
    productData: Omit<ProductType, "id" | "imagesId" | "categories" | "createdAt">,
    images: File[]
  ) => {
    if (
      !productData.title ||
      !productData.price ||
      !images.length ||
      !productData.description ||
      !productData.categoryFormData?.length ||
      (productData.variant.length &&
        productData.variant.some((v) => !v.colorName || !v.price || !v.sizes.length))
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
    if (productData.categoryFormData.length) {
      productData.categoryFormData.map((category) =>
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
            ...data,
            data: updateProducts,
          };
        });
        return true;
      }
      document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });

      setAlertForm((alert) => ({
        ...alert,
        message: productUpdate.message,
      }));

      return false;
    } else {
      const product = await addProduct(formData);
      if (product.success) {
        setProducts((data) => ({
          ...data,
          data: [product.data as ProductType, ...data.data],
        }));
        return true;
      }
      document.getElementById("error-alert-form")?.scrollIntoView({ behavior: "smooth" });

      setAlertForm((alert) => ({
        ...alert,
        message: product.message,
      }));

      return false;
    }
  };

  const handleActiveProduct = async (
    active: boolean,
    id: string,
    setIsActive: Dispatch<SetStateAction<boolean>>
  ) => {
    setIsActive((prev) => !prev);
    const updatePublished = await publishedProduct(id, active);
    if (updatePublished.success) {
      toast.success(active ? "¡Se activo el producto!" : "¡Se desactivo el producto!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    setIsActive((prev) => !prev);
    toast.error(updatePublished.message || "¡Algo salio mal!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  return (
    <Suspense>
      <main className='p-6 max-sm:p-2 space-y-8'>
        <div className='flex max-sm:flex-col max-sm:gap-4 justify-between items-center '>
          <div className='border-l-4 p-2 max-sm:border-0 max-sm:p-0 border-primary'>
            <h2 className='text-2xl font-bold text-foreground mb-2'>Gestión de Productos</h2>
            <p className='text-muted-foreground'>Administra tu catálogo de productos</p>
          </div>
          <div className='flex gap-4 items-center'>
            <Button onClick={handleAddProduct} className='gap-2'>
              <Plus className='w-4 h-4' />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className='space-y-4'>
          <form onSubmit={handleSearch} className='flex gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                type='text'
                placeholder='Buscar productos por nombre...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <Button type='button' variant='outline' onClick={() => setShowFilters(!showFilters)}>
              <Filter className='w-4 h-4 mr-2' />
              Filtros
            </Button>
            {(searchTerm || category || minPrice > 0 || maxPrice < 100000 || onSale) && (
              <Button
                type='button'
                variant='outline'
                className='hover:!bg-black '
                onClick={clearFilters}
              >
                <X className='w-4 h-4 mr-2' />
                Limpiar
              </Button>
            )}
            <Button type='submit'>
              <Search className='w-4 h-4 mr-2' />
              Buscar
            </Button>
          </form>

          {/* Panel de filtros desplegable */}
          {showFilters && (
            <div className='bg-primary/90 text-secondary p-4 rounded-lg border space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Categoría</label>
                  <Select value={category || ""} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder='Todas las categorías' />
                    </SelectTrigger>
                    <SelectContent className='bg-secondary border-primary'>
                      <SelectItem value=''>Todas las categorías</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.title}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Rango de precios</label>
                  <div className='space-y-4'>
                    <Slider
                      min={priceFilter.minPrice}
                      max={priceFilter.maxPrice}
                      step={1000}
                      value={[minPrice, maxPrice]}
                      onValueChange={(value: any) => {
                        setMinPrice(value[0]);
                        setMaxPrice(value[1]);
                      }}
                      className='w-full'
                    />
                    <div className='flex justify-between text-sm'>
                      <span>${minPrice.toLocaleString()}</span>
                      <span>${maxPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Ordenar por</label>
                  <div className='flex gap-2'>
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder='Ordenar por' />
                      </SelectTrigger>
                      <SelectContent className='bg-secondary border-primary'>
                        <SelectItem value='title'>Nombre</SelectItem>
                        <SelectItem value='price'>Precio</SelectItem>
                        <SelectItem value='priceOffer'>Precio oferta</SelectItem>
                        <SelectItem value='createdAt'>Fecha creación</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                      <SelectTrigger className='w-24'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className='bg-secondary border-primary'>
                        <SelectItem value='asc'>Ascendente</SelectItem>
                        <SelectItem value='desc'>Descendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='onSale'
                    checked={onSale}
                    onChange={(e) => setOnSale(e.target.checked)}
                    className='rounded'
                  />
                  <label htmlFor='onSale' className='text-sm'>
                    Solo productos en oferta
                  </label>
                </div>

                <div className='flex items-center space-x-2'>
                  <label className='text-sm'>Mostrar:</label>
                  <Select
                    value={limit.toString()}
                    onValueChange={(value) => setLimit(Number(value))}
                  >
                    <SelectTrigger className='w-20'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-secondary border-primary'>
                      <SelectItem value='12'>12</SelectItem>
                      <SelectItem value='24'>24</SelectItem>
                      <SelectItem value='48'>48</SelectItem>
                      <SelectItem value='96'>96</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Información de búsqueda */}
          {(searchTerm || category || minPrice > 0 || maxPrice < 100000 || onSale) && (
            <div className='flex flex-wrap gap-2 items-center'>
              <span className='text-sm text-muted-foreground'>Filtros aplicados:</span>
              {searchTerm && (
                <Badge variant='default' className='flex items-center gap-1'>
                  Nombre: {searchTerm}
                  <X className='w-3 h-3 cursor-pointer' onClick={() => setSearchTerm("")} />
                </Badge>
              )}
              {category && (
                <Badge variant='default' className='flex items-center gap-1'>
                  Categoría: {category}
                  <X className='w-3 h-3 cursor-pointer' onClick={() => setCategory("")} />
                </Badge>
              )}
              {(minPrice > 0 || maxPrice < 100000) && (
                <Badge variant='default' className='flex items-center gap-1'>
                  Precio: ${minPrice} - ${maxPrice}
                  <X
                    className='w-3 h-3 cursor-pointer'
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(100000);
                    }}
                  />
                </Badge>
              )}
              {onSale && (
                <Badge variant='secondary' className='flex items-center gap-1'>
                  En oferta
                  <X className='w-3 h-3 cursor-pointer' onClick={() => setOnSale(false)} />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Contenido de productos */}
        {products.isLoading ? (
          <ProductCardSkeletonGrid />
        ) : products.data.length ? (
          <>
            <div className={"grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}>
              {products.data.map((product: ProductType) => (
                <TemplateProductDashboard
                  key={product.id}
                  product={product}
                  handleActiveProduct={handleActiveProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  handleEditProduct={handleEditProduct}
                />
              ))}
            </div>

            {/* Paginación */}
            {products.pagination && products.pagination.totalPages > 1 && (
              <div className='flex items-center justify-between border-t pt-4'>
                <div className='text-sm text-muted-foreground'>
                  Mostrando {(page - 1) * limit + 1} -{" "}
                  {Math.min(page * limit, products.pagination.total)} de {products.pagination.total}{" "}
                  productos
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
          </>
        ) : (
          <div className='!mt-12  border-primary/50  max-sm:border-t-4 max-sm:pt-8'>
            <CardContent className='flex flex-col items-center justify-center py-16'>
              <Package className='w-16 h-16 text-muted-foreground mb-4' />
              <h3 className='text-lg font-semibold text-foreground mb-2'>
                {searchTerm || category || minPrice > 0 || maxPrice < 100000 || onSale
                  ? "No se encontraron productos con los filtros aplicados"
                  : "No hay productos"}
              </h3>
              <p className='text-center mb-4'>
                {searchTerm || category || minPrice > 0 || maxPrice < 100000 || onSale
                  ? "Intenta con otros filtros de búsqueda"
                  : "Comienza agregando tu primer producto"}
              </p>
              {(searchTerm || category || minPrice > 0 || maxPrice < 100000 || onSale) && (
                <Button variant='outline' onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              )}
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
          categories={categories}
        />

        <ToastContainer
          position='bottom-right'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
      </main>
    </Suspense>
  );
}
