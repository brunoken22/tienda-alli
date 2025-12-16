"use client";
import { TemplateProduct } from "@/components/templateProduct";
import { useState } from "react";
import { EsqueletonProduct } from "./esqueleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CarouselProduct } from "./carousel";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShoppingCart, useShoppingCartActions } from "@/contexts/product-context";
import { ProductType } from "@/types/product";

export function ProductsFeatured({ featured }: { featured: any }) {
  const [openLinkProduct, setOpenLinkProduct] = useState<string[]>([]);
  const { addItem } = useShoppingCartActions();
  const {
    state: { cart },
  } = useShoppingCart();

  const closeModal = () => {
    setOpenLinkProduct([]);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {featured
        ? featured.map((item: ProductType) => (
            <TemplateProduct
              key={item.id}
              openImg={(data: string[]) => {
                setOpenLinkProduct(data);
                document.body.style.overflow = "hidden";
              }}
              id={item.id}
              Name={item.title}
              Images={item.images}
              price={item.price}
              priceOfert={item.priceOffer}
              oferta={item.priceOffer ? true : false}
              categories={item.categories}
              size={item.sizes}
              addToast={() =>
                toast.success("¡Se agregó al carrito!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                })
              }
              cart={cart}
              addItem={addItem}
            />
          ))
        : Array.from({ length: 8 }, (_, i) => <EsqueletonProduct key={i} />)}

      {openLinkProduct.length > 0 && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='relative w-full max-w-4xl h-full max-h-[90vh] flex flex-col'>
            <div className='flex justify-end mb-4'>
              <Button
                variant='ghost'
                size='icon'
                onClick={closeModal}
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

      <ToastContainer
        position='top-right'
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
    </>
  );
}
