"use client";
import { GetDataProduct } from "@/lib/hook";
import { EsqueletonProduct } from "@/components/esqueleton";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TemplateProduct } from "@/components/templateProduct";
import { FiltroSearch } from "@/components/filtro";
import { FormSearch } from "@/components/ui/form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CarouselProduct } from "@/components/carousel";
import { useDebouncedCallback } from "use-debounce";
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

export default function ProductosPage() {
  const { replace } = useRouter();
  const [openInput, setOpenInput] = useState(false);
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [offset, setOffset] = useState(Number(searchParams.get("offset")) || 0);
  const [typeSearch, setTypeSearch] = useState<string[]>(
    JSON.parse(searchParams.get("type")!) || []
  );
  const [typePrice, setTypePrice] = useState<number[]>(
    JSON.parse(searchParams.get("price")!) || [0, 70000]
  );

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { addItem } = useShoppingCartActions();
  const {
    state: { cart },
  } = useShoppingCart();

  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [openLinkProduct, setOpenLinkProduct] = useState<string[]>([]);

  const useDebouncePrice = useDebouncedCallback((category: string[], price: number[]) => {
    setTypePrice(price);
    setTypeSearch(category);
  }, 1000);

  const { data, isLoading } = GetDataProduct(search, typeSearch, typePrice, 15, offset, order);

  useEffect(() => {
    if (typeSearch) {
      setOffset(0);
    }
  }, [typeSearch]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!typeSearch.length) {
      params.set("q", search);
    } else {
      params.delete("q");
      setSearch("");
    }
    params.set("price", JSON.stringify(typePrice));
    params.set("type", JSON.stringify(typeSearch));
    params.set("limit", JSON.stringify(16));
    params.set("offset", JSON.stringify(offset));

    replace(`?${params.toString()}`);
  }, [typeSearch, typePrice, search, offset, replace, searchParams]);

  const handleModValueFormSearch = (inputSearchFrom: string) => {
    setSearch(inputSearchFrom);
    setTypeSearch([]);
  };

  const handleDefaultParams = {
    typeSearch,
    typePrice,
  };

  const totalResults = data?.pagination?.total || 0;
  const currentResults = data?.results?.length || 0;
  const currentPage = Math.floor(offset / 15) + 1;
  const totalPages = Math.ceil(totalResults / 15);

  console.log(data);
  return (
    <div className='min-h-screen  max-md:p-3  py-8'>
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
        <div className='lg:hidden fixed top-24 right-4 z-30'>
          <Button
            aria-label='Buscar producto'
            size='icon'
            onClick={() => setOpenInput(true)}
            className='rounded-full shadow-lg'
          >
            <Search className='w-5 h-5' />
          </Button>
        </div>
      )}

      <div className='flex gap-8'>
        {/* Sidebar de filtros - Desktop */}
        <aside className='hidden lg:block w-80 h-full flex-shrink-0 bg-primary/90  text-secondary p-4 max-mdp-2 rounded-t-lg'>
          <div className='sticky top-24 bottom-0  '>
            <h2 className='font-semibold text-lg mb-4 flex items-center'>
              <SlidersHorizontal className='w-5 h-5 mr-2' />
              Filtros
            </h2>
            <FiltroSearch
              valueDefault={handleDefaultParams}
              typeCategoriaPrice={useDebouncePrice}
              closeFilter={() => setIsOpenFilter(false)}
              search={search}
              isMobile={false}
            >
              <FormSearch value={search} modValue={handleModValueFormSearch} />
            </FiltroSearch>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className='flex-1 min-w-0'>
          {/* Header de resultados */}
          {data?.data.length ? (
            <div className=' rounded-lg border mb-6 shadow-sm'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <p className='text-sm text-muted-foreground'>
                    Mostrando{" "}
                    <span className='font-medium text-foreground'>
                      {offset + 1}-{Math.min(offset + currentResults, totalResults)}
                    </span>{" "}
                    de <span className='font-medium text-foreground'>{totalResults}</span> productos
                  </p>
                  {(typeSearch.length > 0 || search) && (
                    <Badge variant='secondary' className='text-sm'>
                      {typeSearch.length > 0
                        ? `${typeSearch.length} filtros`
                        : `Búsqueda: "${search}"`}
                    </Badge>
                  )}
                </div>

                <div className='flex items-center gap-4'>
                  {/* Selector de vista */}
                  <div className='hidden sm:flex items-center border rounded-lg p-1'>
                    <Button
                      aria-label='Mostrando en grid'
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("grid")}
                      className='h-8 w-8 p-0'
                    >
                      <Grid3X3 className='w-4 h-4' />
                    </Button>
                    <Button
                      aria-label='Mostrando en uno'
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size='sm'
                      onClick={() => setViewMode("list")}
                      className='h-8 w-8 p-0'
                    >
                      <List className='w-4 h-4' />
                    </Button>
                  </div>

                  {/* Ordenamiento */}
                  <div className='flex items-center gap-2'>
                    <ArrowUpDown className='w-4 h-4 text-muted-foreground' />
                    <select
                      id='price-order-select' // Cambiado a un ID más descriptivo
                      value={order}
                      onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
                      aria-label='Ordenar por precio' // Etiqueta accesible para lectores de pantalla
                      className='text-sm border rounded-md px-3 py-1 bg-background focus:outline-none focus:ring-2 focus:ring-primary'
                    >
                      <option value='desc'>Precio: Mayor a menor</option>
                      <option value='asc'>Precio: Menor a mayor</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Grid de productos */}
          <div
            className={`grid  gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 "
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
                    Name={item.title}
                    Images={
                      item.images?.length
                        ? item.images.filter((itemImages) => typeof itemImages === "string")
                        : []
                    }
                    priceOfert={item.priceOffer}
                    price={item.price}
                    oferta={item.priceOffer ? true : false}
                    id={item.id}
                    // inicio={false}
                    categories={item.categories}
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
          {data?.results?.length === 0 && !isLoading && (
            <div className='text-center py-16'>
              <div className='w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center'>
                <Search className='w-12 h-12 text-muted-foreground' />
              </div>
              <h3 className='text-lg font-semibold mb-2'>No se encontraron productos</h3>
              <p className='text-muted-foreground mb-6'>
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button
                variant='outline'
                onClick={() => {
                  setSearch("");
                  setTypeSearch([]);
                  setTypePrice([0, 70000]);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Paginación */}
          {data?.results?.length && totalPages > 1 ? (
            <div className='flex items-center justify-between mt-8 p-4 bg-card rounded-lg border'>
              <div className='text-sm text-muted-foreground'>
                Página {currentPage} de {totalPages}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setOffset(Math.max(0, offset - 15))}
                  disabled={offset === 0}
                >
                  <ChevronLeft className='w-4 h-4 mr-1' />
                  Anterior
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setOffset(offset + 15)}
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

      {/* Filtros móviles */}
      {isOpenFilter && (
        <div className='fixed inset-0 z-50 lg:hidden'>
          <div className='absolute inset-0 bg-black/90 ' onClick={() => setIsOpenFilter(false)} />
          <div className='absolute right-0 top-0 bottom-0  w-full  shadow-xl'>
            <FiltroSearch
              search={search}
              valueDefault={handleDefaultParams}
              typeCategoriaPrice={useDebouncePrice}
              closeFilter={() => {
                setIsOpenFilter(false);
                setOpenInput(false);
              }}
              isMobile={true}
            />
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
  );
}
