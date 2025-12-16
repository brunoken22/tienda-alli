import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className='bg-primary text-secondary  border-t mt-auto'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Sobre Nosotros</h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Tu tienda online de confianza con los mejores productos y la mejor atención al
              cliente.
            </p>
            <div className='flex gap-3'>
              <Link
                href='#'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Facebook'
              >
                <Facebook className='w-4 h-4' />
              </Link>
              <Link
                href='#'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Instagram'
              >
                <Instagram className='w-4 h-4' />
              </Link>
              <Link
                href='#'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Twitter'
              >
                <Twitter className='w-4 h-4' />
              </Link>
              <Link
                href='#'
                className='w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors'
                aria-label='Youtube'
              >
                <Youtube className='w-4 h-4' />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Enlaces Rápidos</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/productos'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href='/categorias'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href='/ofertas'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href='/novedades'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Novedades
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Atención al Cliente</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/ayuda'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  href='/envios'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href='/terminos'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href='/privacidad'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Contacto</h3>
            <ul className='space-y-3 text-sm'>
              <li className='flex items-start gap-3'>
                <MapPin className='w-4 h-4 mt-1 text-muted-foreground flex-shrink-0' />
                <span className='text-muted-foreground'>
                  Calle Principal 123,
                  <br />
                  Ciudad, País 12345
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                <Link
                  href='tel:+1234567890'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  +1 (234) 567-890
                </Link>
              </li>
              <li className='flex items-center gap-3'>
                <Mail className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                <Link
                  href='mailto:info@tutienda.com'
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  info@tutienda.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              © {new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.
            </p>
            <div className='flex gap-6 text-sm'>
              <Link
                href='/cookies'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Política de Cookies
              </Link>
              <Link
                href='/accesibilidad'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Accesibilidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
