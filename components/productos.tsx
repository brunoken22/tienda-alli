"use client";
import { GetDataProduct } from "@/lib/hook";
import { EsqueletonProduct } from "@/components/esqueleton";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormSearch } from "@/components/ui/form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CarouselProduct } from "@/components/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
} from "lucide-react";
import { useShoppingCart, useShoppingCartActions } from "@/contexts/product-context";
import { ProductType } from "@/types/product";
import TemplateProduct from "./templateProduct";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryType } from "@/types/category";
import { getCategories } from "@/lib/category";
import { PriceFilterType } from "@/types/price-filter";
import { getPriceFilter } from "@/lib/price";

export default function ProductosPage() {
  const { replace } = useRouter();
  const [openInput, setOpenInput] = useState(false);
  const searchParams = useSearchParams();

  // Estados para filtros
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [offset, setOffset] = useState(Number(searchParams.get("offset")) || 0);
  const [typeSearch, setTypeSearch] = useState<string[]>(
    JSON.parse(searchParams.get("type") || "[]")
  );
  const [onSale, setOnSale] = useState(searchParams.get("onSale") === "true");

  // Estados para el nuevo sistema de filtros
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0
  );
  const [priceFilter, setPriceFilter] = useState<PriceFilterType>({
    maxPrice: 1000000,
    minPrice: 0,
    maxPriceOffer: 1000000,
    minPriceOffer: 0,
  });

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : priceFilter.maxPrice
  );
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);
  const [sortBy, setSortBy] = useState<"title" | "price" | "createdAt">(
    (searchParams.get("sortBy") as any) || "price"
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem } = useShoppingCartActions();
  const {
    state: { cart },
  } = useShoppingCart();

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [openLinkProduct, setOpenLinkProduct] = useState<string[]>([]);

  //Categorias de los productos
  const [categories, setCategories] = useState<CategoryType[]>([]);

  // Usar el hook existente pero con los nuevos parámetros
  const { data, isLoading } = GetDataProduct(
    search,
    category ? [category] : typeSearch, // Combinar category con typeSearch
    [minPrice, maxPrice], // Usar minPrice y maxPrice en lugar de typePrice
    limit,
    offset,
    order,
    onSale,
    sortBy
  );

  // Actualizar URL con todos los parámetros
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    params.set("minPrice", minPrice.toString());
    params.set("maxPrice", maxPrice.toString());
    params.set("type", JSON.stringify(typeSearch));
    params.set("limit", limit.toString());
    params.set("offset", offset.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", order);

    replace(`?${params.toString()}`);
  }, [
    search,
    category,
    minPrice,
    maxPrice,
    typeSearch,
    limit,
    offset,
    sortBy,
    order,
    replace,
    searchParams,
  ]);

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

  const handleModValueFormSearch = (inputSearchFrom: string) => {
    setSearch(inputSearchFrom);
    setCategory(""); // Limpiar categoría al buscar por texto
    setTypeSearch([]);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice(0);
    setMaxPrice(priceFilter.maxPrice);
    setTypeSearch([]);
    setOffset(0);
    setSortBy("price");
    setOrder("desc");
  };

  const totalResults = data?.pagination?.total || 0;
  const currentResults = data?.results?.length || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalResults / limit);

  // Verificar si hay filtros activos
  const hasActiveFilters =
    search || category || minPrice > 0 || maxPrice < priceFilter.maxPrice || typeSearch.length > 0;

  return (
    <Suspense>
      <div className='min-h-screen max-md:p-3 py-8 px-2'>
        {/* Header de búsqueda móvil */}
        {openInput && (
          <div className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden'>
            <div className='bg-white m-4 mt-24 rounded-lg p-4 shadow-xl'>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='flex-1'>
                  <FormSearch value={search} modValue={handleModValueFormSearch} />
                </div>
                <Button variant='ghost' size='icon' onClick={() => setOpenInput(false)}>
                  <X className='w-5 h-5' />
                </Button>
              </div>
              <Button
                variant='outline'
                onClick={() => {
                  setIsOpenFilter(true);
                  setOpenInput(false);
                }}
                className='w-full'
              >
                <Filter className='w-4 h-4 mr-2' />
                Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Botón de búsqueda móvil flotante */}
        {!openInput && (
          <div className='lg:hidden fixed bottom-20 right-6 z-30 w-12 h-12'>
            <Button
              aria-label='Buscar producto'
              size='icon'
              onClick={() => setOpenInput(true)}
              className='w-full h-full !rounded-full shadow-lg '
            >
              <Search className='w-6 h-6 ' />
            </Button>
          </div>
        )}

        <div className='flex gap-8 relative'>
          {/* Sidebar de filtros - Desktop */}
          <aside className='hidden lg:block w-80 h-full flex-shrink-0 bg-primary/90 text-secondary p-4 max-mdp-2 rounded-t-lg'>
            <div className='sticky top-24 bottom-0'>
              <h2 className='font-semibold text-lg mb-4 flex items-center'>
                <SlidersHorizontal className='w-5 h-5 mr-2' />
                Filtros
              </h2>

              {/* Barra de búsqueda en sidebar */}
              <div className='mb-6'>
                <FormSearch value={search} modValue={handleModValueFormSearch} />
              </div>

              {/* Filtro de categoría */}
              <div className='space-y-2 mb-6'>
                <label className='text-sm font-medium'>Categoría</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className='bg-secondary text-black border-primary/30'>
                    <SelectValue placeholder='Todas las categorías' />
                  </SelectTrigger>
                  <SelectContent className='bg-secondary text-black border-primary'>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de rango de precios */}
              <div className='space-y-4 mb-6'>
                <label className='text-sm font-medium'>Rango de precios</label>
                <div className='space-y-4'>
                  <Slider
                    min={priceFilter.minPrice}
                    max={priceFilter.maxPrice}
                    value={[minPrice, maxPrice]}
                    onValueChange={(value: any) => {
                      setMinPrice(value[0]);
                      setMaxPrice(value[1]);
                    }}
                    className='w-full bg-red-500'
                  />
                  <div className='flex justify-between text-sm'>
                    <span>${minPrice.toLocaleString()}</span>
                    <span>${maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ordenamiento */}
              <div className='space-y-2 mb-6'>
                <label className='text-sm  font-medium'>Ordenar por</label>
                <div className='flex gap-2 text-black'>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className='bg-secondary border-primary/30'>
                      <SelectValue placeholder='Ordenar por' />
                    </SelectTrigger>
                    <SelectContent className='bg-secondary border-primary'>
                      <SelectItem value='price'>Precio</SelectItem>
                      <SelectItem value='title'>Nombre</SelectItem>
                      <SelectItem value='createdAt'>Más recientes</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={order} onValueChange={(value: any) => setOrder(value)}>
                    <SelectTrigger className='w-24 bg-secondary border-primary/30'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-secondary border-primary'>
                      <SelectItem value='desc'>Desc</SelectItem>
                      <SelectItem value='asc'>Asc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mostrar por página */}
              <div className='space-y-2 mb-6 '>
                <label className='text-sm font-medium '>Mostrar por página</label>
                <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                  <SelectTrigger className='bg-secondary text-black border-primary/30'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-secondary text-black border-primary'>
                    <SelectItem value='12'>12</SelectItem>
                    <SelectItem value='24'>24</SelectItem>
                    <SelectItem value='36'>36</SelectItem>
                    <SelectItem value='48'>48</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Solo ofertas */}
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

              {/* Botón limpiar filtros */}
              {hasActiveFilters && (
                <Button
                  variant='outline'
                  onClick={clearFilters}
                  className='w-full mt-4 border-red-300 text-red-100 hover:bg-red-50 hover:!text-red-700'
                >
                  <X className='w-4 h-4 mr-2' />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </aside>

          {/* Contenido principal */}
          <main className='flex-1 min-w-0'>
            {/* Información de filtros aplicados */}
            {hasActiveFilters && (
              <div className='mb-6 p-4 bg-primary/80 text-secondary rounded-lg border'>
                <div className='flex flex-wrap gap-2 items-center'>
                  <span className='text-sm text-muted-foreground'>Filtros aplicados:</span>
                  {search && (
                    <Badge variant='default' className='flex items-center gap-1'>
                      Buscar: {search}
                      <X
                        className='w-3 h-3 cursor-pointer hover:text-red-500'
                        onClick={() => setSearch("")}
                      />
                    </Badge>
                  )}
                  {category && (
                    <Badge variant='default' className='flex items-center gap-1 '>
                      Categoría: {category}
                      <X
                        className='w-3 h-3 cursor-pointer hover:text-red-500'
                        onClick={() => setCategory("")}
                      />
                    </Badge>
                  )}
                  {(minPrice > 0 || maxPrice < 70000) && (
                    <Badge variant='default' className='flex items-center gap-1'>
                      Precio: ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                      <X
                        className='w-3 h-3 cursor-pointer hover:text-red-500'
                        onClick={() => {
                          setMinPrice(0);
                          setMaxPrice(70000);
                        }}
                      />
                    </Badge>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearFilters}
                    className='ml-auto text-sm border border-red-300 text-red-100 hover:bg-red-50 hover:text-red-700'
                  >
                    Limpiar todo
                  </Button>
                </div>
              </div>
            )}

            {/* Header de resultados */}
            {data?.data?.length ? (
              <div className='rounded-lg border border-primary/30 mb-6 shadow-sm'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4'>
                  <div className='flex items-center gap-4'>
                    <p className='text-sm text-muted-foreground'>
                      Mostrando{" "}
                      <span className='font-medium text-foreground'>
                        {offset + 1}-{Math.min(offset + currentResults, totalResults)}
                      </span>{" "}
                      de <span className='font-medium text-foreground'>{totalResults}</span>{" "}
                      productos
                    </p>
                  </div>

                  <div className='flex items-center gap-4'>
                    {/* Selector de vista */}
                    <div className='hidden sm:flex items-center border rounded-lg p-1'>
                      <Button
                        aria-label='Vista en grid'
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("grid")}
                        className='h-8 w-8 p-0'
                      >
                        <Grid3X3 className='w-4 h-4' />
                      </Button>
                      <Button
                        aria-label='Vista en lista'
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size='sm'
                        onClick={() => setViewMode("list")}
                        className='h-8 w-8 p-0'
                      >
                        <List className='w-4 h-4' />
                      </Button>
                    </div>

                    {/* Ordenamiento */}
                    {/*<div className='flex items-center gap-2'>
                      <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                      <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                        aria-label='Ordenar por precio'
                        className='text-sm border rounded-md px-3 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                      >
                        <option value='desc'>Precio: Mayor a menor</option>
                        <option value='asc'>Precio: Menor a mayor</option>
                      </select>
                    </div> */}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Grid de productos (MANTENIDO COMO ESTABA) */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {data?.data?.length
                ? data.data.map((item: ProductType) => (
                    <TemplateProduct
                      addItem={addItem}
                      cart={cart}
                      key={item.id}
                      openImg={(data: string[]) => {
                        setOpenLinkProduct(data);
                        document.body.style.overflow = "hidden";
                      }}
                      title={item.title}
                      images={
                        item.images?.length
                          ? item.images.filter((itemImages) => typeof itemImages === "string")
                          : []
                      }
                      variants={item.variant}
                      priceOffer={item.priceOffer}
                      price={item.price}
                      id={item.id}
                      size={item.sizes}
                      addToast={() =>
                        toast.success("¡Producto agregado al carrito!", {
                          position: "bottom-right",
                          autoClose: 3000,
                        })
                      }
                    />
                  ))
                : null}

              {/* Esqueletos de carga */}
              {isLoading && Array.from({ length: 12 }, (_, i) => <EsqueletonProduct key={i} />)}
            </div>

            {/* Estado vacío */}
            {data?.data?.length === 0 && !isLoading && (
              <div className='text-center py-16'>
                <div className='w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                  <Search className='w-12 h-12 text-muted-foreground' />
                </div>
                <h3 className='text-lg font-semibold mb-2'>No se encontraron productos</h3>
                <p className='text-muted-foreground mb-6'>
                  {hasActiveFilters
                    ? "Intenta ajustar tus filtros de búsqueda"
                    : "No hay productos disponibles en este momento"}
                </p>
                {hasActiveFilters && (
                  <Button variant='outline' onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}

            {/* Paginación */}
            {data?.data?.length && totalPages > 1 ? (
              <div className='flex items-center justify-between mt-8 p-4 bg-card rounded-lg border'>
                <div className='text-sm text-muted-foreground'>
                  Página {currentPage} de {totalPages}
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setOffset(Math.max(0, offset - limit))}
                    disabled={offset === 0}
                  >
                    <ChevronLeft className='w-4 h-4 mr-1' />
                    Anterior
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setOffset(offset + limit)}
                    disabled={offset + currentResults >= totalResults}
                  >
                    Siguiente
                    <ChevronRight className='w-4 h-4 ml-1' />
                  </Button>
                </div>
              </div>
            ) : null}
          </main>
        </div>

        {/* Modal de imágenes */}
        {openLinkProduct.length > 0 && (
          <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='relative w-full max-w-4xl h-full max-h-[90vh] flex flex-col'>
              <div className='flex justify-end mb-4'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => {
                    setOpenLinkProduct([]);
                    document.body.style.overflow = "auto";
                  }}
                  className='text-white hover:bg-white/20 rounded-full'
                >
                  <X className='w-6 h-6' />
                </Button>
              </div>
              <div className='flex-1 flex items-center justify-center'>
                <CarouselProduct imgs={openLinkProduct} />
              </div>
            </div>
          </div>
        )}

        {/* Filtros móviles (modal) */}
        {isOpenFilter && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <div className='absolute inset-0 bg-black/90' onClick={() => setIsOpenFilter(false)} />
            <div className='absolute right-0 top-0 bottom-0 w-full max-w-sm bg-primary/90 shadow-xl p-6 overflow-y-auto text-secondary'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold'>Filtros</h2>
                <Button variant='ghost' size='icon' onClick={() => setIsOpenFilter(false)}>
                  <X className='w-5 h-5' />
                </Button>
              </div>

              {/* Barra de búsqueda */}
              <div className='mb-6'>
                <FormSearch value={search} modValue={handleModValueFormSearch} />
              </div>

              {/* Filtro de categoría */}
              <div className='space-y-2 mb-6'>
                <label className='text-sm font-medium'>Categoría</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder='Todas las categorías' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.title}>
                        {cat.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro de precio */}
              <div className='space-y-4 mb-6'>
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
                  />
                  <div className='flex justify-between text-sm'>
                    <span>${minPrice.toLocaleString()}</span>
                    <span>${maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ordenamiento */}
              <div className='space-y-2 mb-6'>
                <label className='text-sm font-medium'>Ordenar por</label>
                <div className='flex gap-2'>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder='Ordenar por' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='price'>Precio</SelectItem>
                      <SelectItem value='title'>Nombre</SelectItem>
                      <SelectItem value='createdAt'>Más recientes</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={order} onValueChange={(value: any) => setOrder(value)}>
                    <SelectTrigger className='w-24'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='desc'>Desc</SelectItem>
                      <SelectItem value='asc'>Asc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mostrar por página */}
              <div className='space-y-2 mb-6'>
                <label className='text-sm font-medium'>Mostrar por página</label>
                <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='12'>12</SelectItem>
                    <SelectItem value='24'>24</SelectItem>
                    <SelectItem value='36'>36</SelectItem>
                    <SelectItem value='48'>48</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Botones de acción */}
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={clearFilters}
                  className='flex-1 !bg-red-300 !border-red-500 text-red-500 hover:!bg-red-500'
                >
                  Limpiar
                </Button>
                <Button
                  onClick={() => setIsOpenFilter(false)}
                  className='flex-1 bg-secondary !text-primary hover:!bg-secondary/70'
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </Suspense>
  );
}
