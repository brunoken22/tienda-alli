"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Copy, X, Download, MessageCircle } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { GeneratePdf } from "./generatePdf";
import { useShoppingCart } from "@/contexts/product-context";
import { ShoppingCart } from "@/types/shopping-cart";

interface ModalProps {
  closeModal: (data: boolean) => void;
}

export default function Modal({ closeModal }: ModalProps) {
  const {
    state: { cart },
  } = useShoppingCart();
  const [textShoppingCopy, setTextShoppingCopy] = useState("");
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Calcular total
  const calculateTotal = useCallback((items: Omit<ShoppingCart, "variant">[]) => {
    return items.reduce(
      (accumulator, item) =>
        accumulator + (item.priceOffer > 0 ? item.priceOffer : item.price) * (item.quantity || 1),
      0
    );
  }, []);

  const total = calculateTotal(cart);

  const formattedTotal = total.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Generar texto para copiar y WhatsApp
  useEffect(() => {
    if (cart && cart.length > 0) {
      try {
        const orderItems = cart
          .map((item) => {
            // Validaciones robustas
            const quantity = item.quantity || 1;
            const title = item.title?.trim() || "Producto sin nombre";
            const size = item.variantSize?.toString()?.trim() || "Por seleccionar";

            return `- ${quantity} ${title} (Talle: ${size})`;
          })
          .filter(Boolean)
          .join("\n"); // Filtrar líneas vacías

        const orderText = `*DETALLE DEL PEDIDO*
      
${orderItems}

 *TOTAL: ${formattedTotal || "$0"}*

_*Este pedido fue generado automáticamente desde la tienda online.*_`;

        setTextShoppingCopy(orderText);
      } catch (error) {
        console.error("Error generando texto del pedido:", error);
        setTextShoppingCopy(
          "Error al generar el resumen del pedido. Por favor, contacta al vendedor."
        );
      }
    } else {
      setTextShoppingCopy("No hay productos en el carrito.");
    }
  }, [cart, formattedTotal]);

  // Manejar notificación de copiado
  useEffect(() => {
    if (showCopySuccess) {
      const timeout = setTimeout(() => {
        setShowCopySuccess(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showCopySuccess]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeModal]);

  const handleCopySuccess = () => {
    setShowCopySuccess(true);
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/541159102865?text=${encodeURIComponent(textShoppingCopy)}`;
    window.open(whatsappUrl, "_blank");
    closeModal(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal(false);
    }
  };

  if (!cart?.length) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
        <div className='bg-white rounded-lg p-6 max-w-md w-[95%] mx-auto'>
          <h3 className='text-xl font-semibold text-gray-900 mb-4'>Carrito vacío</h3>
          <p className='text-gray-600 mb-6'>No tienes productos en tu carrito de compras.</p>
          <button
            onClick={() => closeModal(false)}
            className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-[95%] max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <div>
            <h3 className='text-2xl font-semibold text-gray-900'>Resumen de tu pedido</h3>
            <p className='text-gray-600 mt-1'>
              Revisa tu pedido, descarga el PDF o envíalo por WhatsApp
            </p>
          </div>
          <button
            onClick={() => closeModal(false)}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Cerrar modal'
          >
            <X className='h-5 w-5 text-gray-500' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 p-6 pb-2 overflow-hidden'>
          {/* Lista de productos */}
          <div className='mb-6'>
            <h4 className='text-lg font-medium text-gray-900 mb-4'>Productos:</h4>
            <div className='max-h-80 overflow-y-auto border border-gray-200 rounded-lg'>
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className='p-4 border-b border-gray-100 last:border-b-0'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                        {item.quantity || 1}
                      </span>
                      <div>
                        <p className='font-medium text-gray-900'>{item.title}</p>
                        <p className='text-sm text-gray-500'>Talla: {item.variantSize}</p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium text-gray-900'>
                        {(
                          (item.priceOffer > 0 ? item.priceOffer : item.price) * item.quantity
                        ).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {item.price.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                        c/u
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className='bg-gray-50 rounded-lg p-4 mb-4'>
            <div className='flex justify-between items-center'>
              <span className='text-lg font-semibold text-gray-900'>Total:</span>
              <span className='text-2xl font-bold text-blue-600'>{formattedTotal}</span>
            </div>
          </div>

          {/* Botón copiar */}
          <div className='flex justify-center mb-6 relative'>
            {showCopySuccess && (
              <div className='absolute -top-12 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg'>
                ¡Pedido copiado al portapapeles!
              </div>
            )}
            <CopyToClipboard text={textShoppingCopy} onCopy={handleCopySuccess}>
              <button className='flex items-center gap-2 bg-primary/80 hover:bg-primary/60 text-secondary px-4 py-2 rounded-lg transition-colors'>
                <Copy className='h-4 w-4' />
                Copiar pedido
              </button>
            </CopyToClipboard>
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-col sm:flex-row gap-3 p-6 pt-0 border-t border-gray-200'>
          <PDFDownloadLink
            document={<GeneratePdf data={cart} />}
            fileName='pedido-tienda-alli.pdf'
            className='flex-1'
          >
            <button className='w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition-colors'>
              <Download className='h-4 w-4' />
              Descargar PDF
            </button>
          </PDFDownloadLink>

          <button
            onClick={handleWhatsAppClick}
            className='flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors'
          >
            <MessageCircle className='h-4 w-4' />
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
